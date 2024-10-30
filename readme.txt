Requirements:
Node - https://nodejs.org/en/
Git - https://git-scm.com/downloads


Setup:
Clone https://git.builderdesigns.com/jerome/dsldhomes.com-2016.git
cd dsldhomes.com-2016
npm install


Start development environment
  `npm run serve`

Stop development environment
  [CTRL] + C

Build production files and save to 'dist' folder.
  `npm run build`

Preview dist folder
  `npm run serve:dist`


Master branch is production
Staging branch is testing
[Your branch here] is dev


Favicon is generated from /images/favicon.png


Try to keep site-specific code in CommonController or index.html and wrapped in
client name comments (<!--DSLD-->).  The rest of index.js should be generic.
CommonController 'filters' are a work in progress.  Would be nice to have a
generic set to use across all sites.


FAQ:

It gave me the thing when trying to commit (VIM)?
[Escape] :WQ [Enter]

How to smooth scroll without adding # to URL
Replace <a href="#target"> with <a href ng-click="scroll('#target')">
See index.js for more options.
