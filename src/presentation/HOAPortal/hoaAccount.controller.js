const app = window.ANGULAR_APP;

function HoaAccountController($state, hoaPortalService) {
  const ctrl = this;

  ctrl.user = hoaPortalService.user;
  ctrl.familyMembers = [];

  function filterResidents(residents) {
    return residents.filter(resident => resident.hoa_primary === ctrl.user._id);
  }

  hoaPortalService
    .getResidents()
    .then((residents) => {
      ctrl.familyMembers = filterResidents(residents);
    });

  ctrl.addFamilyMember = () => {
    ctrl.familyMembers.push({});
  };

  ctrl.deleteUser = (user) => {
    const userIndex = ctrl.familyMembers.indexOf(user);
    if (userIndex !== -1) {
      ctrl.familyMembers.splice(userIndex, 1);
    }
  };

  ctrl.saveUser = (user) => {
    if (user._id === ctrl.user._id) {
      hoaPortalService.saveUser(user)
        .then((newUser) => {
          hoaPortalService.setUser(newUser);
          ctrl.user = newUser;

          const userIndex = hoaPortalService.residents.reduce((val, resident, index) => {
            if (val === -1 && resident._id === newUser._id) {
              return index;
            }
            return val;
          }, -1);

          if (userIndex !== -1) {
            hoaPortalService.residents.splice(userIndex, 1, newUser);
            ctrl.familyMembers = filterResidents(hoaPortalService.residents);
          }
        });
    }


    const userIndex = hoaPortalService.residents.reduce((val, resident, index) => {
      if (val === -1 && resident._id === user._id) {
        return index;
      }
      return val;
    }, -1);

    if (userIndex !== -1) {
      hoaPortalService.saveUser(user)
        .then((newUser) => {
          hoaPortalService.residents.splice(userIndex, 1, newUser);
          ctrl.familyMembers = filterResidents(hoaPortalService.residents);
        });
    }
  };
}

app.controller('HoaAccountController', HoaAccountController);
