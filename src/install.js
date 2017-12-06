// Another XpiInstaller
// By y5
// (Heavily inspired by code from MonkeeSage, who was...)
// (Heavily inspired by code from Pike, who was...)
// (Heavily inspired by code from Henrik Gemal and Stephen Clavering)

var objInstaller =
{
	sPackageID: '{35106bca-6c78-48c7-ac28-56df30b51d2a}',
	sDisplayName: 'Linkification',
	sExtensionName: 'linkification',
	sVersion: '1.3.9',
	aLocales: ['ar', 'be-BY', 'ca-AD', 'cs-CZ', 'da-DK', 'de-DE', 'en-US', 'es-ES', 'fa-IR', 'fi-FI', 'fr-FR', 'fy-NL', 'he-IL', 'hr-HR', 'hu-HU', 'it-IT', 'ja-JP', 'ko-KR', 'nb-NO', 'nl-NL', 'pl-PL', 'pt-BR', 'ru-RU', 'sk-SK', 'sl-SI', 'sv-SE', 'tr-TR', 'uk-UA', 'zh-CN', 'zh-TW'],
	aSkins: ['classic'],
	aPreferences: ['linkification.js'],
	sPostInstallMessage: null,

	bProfileInstall: false,
	bSilentInstall : true,

	install: function()
	{
		var sJarFile    = this.sExtensionName + '.jar';
		var sProfileFolder = Install.getFolder('Profile', 'extensions/' + this.sPackageID);
		var sGlobalFolder  = Install.getFolder('Program', 'extensions/' + this.sPackageID);

		this.parseArguments();

		if (File.exists(Install.getFolder(sProfileFolder, 'chrome/' + sJarFile)))
		{
			if (!this.bSilentInstall)
			{
				Install.alert('Updating existing Profile install of ' + this.sDisplayName + ' to version ' + this.sVersion + '.');
			}
			this.bProfileInstall = true;
		}
		else if (!this.bSilentInstall)
		{
			this.bProfileInstall = Install.confirm('Install ' + this.sDisplayName + ' ' + this.sVersion + ' to the Profile directory [OK] or ' + 'the Browser directory [Cancel]?');
		}

		var nInstallType = this.bProfileInstall ? Install.PROFILE_CHROME : Install.DELAYED_CHROME;
		var sInstallPath = this.bProfileInstall ? sProfileFolder : sGlobalFolder;

		Install.initInstall(this.sDisplayName, this.sExtensionName, this.sVersion);
		Install.addFile(this.sExtensionName, this.sVersion, 'chrome/' + sJarFile, Install.getFolder(sInstallPath, 'chrome'), null);
		var sJarPath = Install.getFolder(sInstallPath, 'chrome/' + sJarFile);

		var sPreferenceFolder = Install.getFolder('Program', 'defaults/pref');
		for (var nPreference = 0; nPreference < this.aPreferences.length; ++nPreference)
		{
			Install.addFile(this.sExtensionName, this.sVersion, 'defaults/preferences/' + this.aPreferences[nPreference], sPreferenceFolder, null);
		}

		Install.registerChrome(Install.CONTENT | nInstallType, sJarPath, 'content/' + this.sExtensionName + '/');

		for (var nSkin = 0; nSkin < this.aSkins.length; ++nSkin)
		{
			var sPath = 'skin/' + this.aSkins[nSkin] + '/' + this.sExtensionName + '/';
			Install.registerChrome(Install.SKIN | nInstallType, sJarPath, sPath);
		}

		for (var nLocale = 0; nLocale < this.aLocales.length; ++nLocale)
		{
			var sPath = 'locale/' + this.aLocales[nLocale] + '/';
			Install.registerChrome(Install.LOCALE | nInstallType, sJarPath, sPath);
		}

		var err = Install.performInstall();
		if (err == Install.SUCCESS || err == Install.REBOOT_NEEDED)
		{
			if (!this.bSilentInstall && this.sPostInstallMessage)
			{
				Install.alert('The ' + this.sDisplayName + ' ' + this.sVersion + ' extension has been ' + 'succesfully installed.\n\n' + sJarPath + '\n\n' + this.sPostInstallMessage);
			}
		}
		else
		{
			this.handleError(err);
			return;
		}
	},

	parseArguments: function()
	{
		// Can't use string handling in install, so use if statement instead
		var aArguments = Install.arguments;
		if (aArguments == 'p=0')
		{
			this.bProfileInstall = false;
			this.bSilentInstall = true;
		}
		else if (aArguments == 'p=1')
		{
			this.bProfileInstall = true;
			this.bSilentInstall = true;
		}
	},

	handleError: function(err)
	{
		if (!this.bSilentInstall)
		{
			Install.alert('Error: Could not install ' + this.sDisplayName + ' ' + this.sVersion + ' (Error code: ' + err + ')');
		}
		Install.cancelInstall(err);
	}
};

objInstaller.install();