const app = window.ANGULAR_APP;

function HoaResidentController($state, hoaPortalService) {
  const ctrl = this;
  ctrl.residents = [];
  ctrl.loading = true;

  ctrl.loadResidents = () => {
    hoaPortalService
      .getResidents()
      .then((residents) => {
        ctrl.residents = residents.map((resident) => {
          const primary = residents.find(res => res._id === resident.hoa_primary);
          const nameSplit = resident.name.split(' ');
          let familyName = nameSplit[nameSplit.length - 1];

          if (primary) {
            const primaryName = primary.name.split(' ');
            familyName = primaryName[primaryName.length - 1];
          }

          return {
            ...resident,
            familyName,
          };
        });
        ctrl.loading = false;
      });
  };

  ctrl.sortField = 'familyName';
  ctrl.sortReverse = false;

  ctrl.setSort = (field) => {
    if (field === ctrl.sortField) {
      ctrl.sortReverse = !ctrl.sortReverse;
    } else {
      ctrl.sortField = field;
      ctrl.sortReverse = false;
    }
  };

  ctrl.isSort = (field, isReversed) => {
    if (field !== ctrl.sortField) {
      return false;
    }

    return ctrl.sortReverse === isReversed;
  };

  ctrl.loadResidents();
}

app.controller('HoaResidentController', HoaResidentController);
