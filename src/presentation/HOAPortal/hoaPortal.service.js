const app = window.ANGULAR_APP;
const contactApi = 'https://api.mybuildercloud.com/api/v2/hoa-portal';

function HOAPortalService($q, $http, $localStorage, jwtHelper, builderService, $state) {
  const storage = $localStorage;

  return {
    user: storage.hoa_user || null,
    token: storage.hoa_token || null,
    residents: null,
    resources: null,
    portals: null,
    portal: null,
    getHeaders(token) {
      const useToken = token || this.token;
      return {
        Authorization: `Bearer ${useToken}`,
      };
    },
    isLoggedIn() {
      return this.token !== null && !jwtHelper.isTokenExpired(this.token);
    },
    login(email, password) {
      return $http({
        method: 'POST',
        data: {
          email,
          password,
          builder: window.BID,
        },
        headers: this.getHeaders(),
        url: `${contactApi}/login`,
      })
        .then((resp) => {
          this.user = resp.data.user;
          this.token = resp.data.token;
          storage.hoa_token = this.token;
          storage.hoa_user = this.user;
        });
    },
    logout() {
      this.user = null;
      this.token = null;
      this.portals = null;
      this.portal = null;
      this.resources = null;
      this.residents = null;
      delete storage.hoa_token;
      delete storage.hoa_user;
    },
    saveUser(user) {
      return $http({
        method: 'POST',
        data: {
          ...user,
        },
        headers: this.getHeaders(),
        url: `${contactApi}/save`,
      })
        .then(resp => resp.data.user);
    },
    setUser(user) {
      this.user = user;
      storage.hoa_user = user;
    },
    requestPasswordReset(email) {
      return $http({
        method: 'POST',
        data: {
          builder: window.BID,
          email,
          builder_name: builderService.data.name,
          reset_url: $state.href('hoa-password-reset', { token: 'token' }, { absolute: true }),
        },
        headers: this.getHeaders(),
        url: `${contactApi}/password-reset/request`,
      })
        .then(resp => resp.data.message);
    },
    submitPasswordReset(token, password) {
      return $http({
        method: 'POST',
        data: {
          builder: window.BID,
          password,
        },
        headers: this.getHeaders(token),
        url: `${contactApi}/password-reset`,
      })
        .then((resp) => {
          this.user = resp.data.user;
          this.token = resp.data.token;
          storage.hoa_token = this.token;
          storage.hoa_user = this.user;

          return resp.data.message;
        });
    },
    getResources() {
      if (this.resources === null) {
        return $http({
          method: 'GET',
          headers: this.getHeaders(),
          url: `${contactApi}/resources`,
        })
          .then((resp) => {
            this.resources = resp.data;
            return this.resources;
          });
      }

      return $q.resolve(this.resources);
    },
    getResidents() {
      if (this.residents === null) {
        return $http({
          method: 'GET',
          headers: this.getHeaders(),
          url: `${contactApi}/residents`,
        })
          .then((resp) => {
            this.residents = resp.data._items;
            return this.residents;
          });
      }

      return $q.resolve(this.residents);
    },
    getPortals() {
      if (this.portals === null) {
        return $http({
          method: 'POST',
          data: {
            builder: window.BID,
          },
          headers: this.getHeaders(),
          url: `${contactApi}/portals`,
        })
          .then((resp) => {
            this.portals = resp.data;
            return this.portals;
          });
      }

      return $q.resolve(this.portals);
    },
    getPortal() {
      if (this.portal === null) {
        return $http({
          method: 'GET',
          headers: this.getHeaders(),
          url: `${contactApi}/portal`,
        })
          .then((resp) => {
            this.portal = resp.data;
            return this.portal;
          });
      }

      return $q.resolve(this.portal);
    },
    register(user) {
      const { confirm_password, ...cleanUser } = user;
      return $http({
        method: 'POST',
        data: {
          builder: window.BID,
          ...cleanUser,
          hoa_community: {
            _id: user.hoa_community._id,
            name: user.hoa_community.name,
          },
        },
        headers: this.getHeaders(),
        url: `${contactApi}/register`,
      })
        .then(resp => resp.data.user);
    },
    contactManagement(message) {
      return $http({
        method: 'POST',
        data: {
          builder: window.BID,
          builder_name: builderService.data.name,
          message,
        },
        headers: this.getHeaders(),
        url: `${contactApi}/contact-management`,
      });
    },
  };
}

app.service('hoaPortalService', HOAPortalService);
