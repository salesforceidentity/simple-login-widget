var SFIDWidget_loginHandler;
function SFIDWidget_handleOpenIDCallback(response) {
	window.opener[SFIDWidget_loginHandler](response);
	window.close();
};

var SFIDWidget = function() {
	
	this.config = null;
	this.access_token = null;
	this.openid = null;
	this.openid_response = null;
	
	function addButton(targetDiv) {
		targetDiv.innerHTML = '';
		var button = document.createElement("button"); 
	 	button.className = "sfid-button";
		button.innerHTML = "Log in";
		button.setAttribute("onClick", "SFIDWidget.login()");
		targetDiv.appendChild(button);		
	}
	
	

	return {
		init: function() {
			
			SFIDWidget.config = {};
			
			SFIDWidget.config.startURL = location.pathname+location.search;
			
			var communityURLTag = document.querySelector('meta[name="salesforce-community"]');
			if (communityURLTag == null) {
				alert('Specify a meta-tag for salesforce-community');
				return;
			} else {
				SFIDWidget.config.communityURL = communityURLTag.content;
				var rawDomain = SFIDWidget.config.communityURL.substring(8,SFIDWidget.config.communityURL.length);
				if (rawDomain.indexOf("/") > 0) rawDomain = rawDomain.substring(0,rawDomain.indexOf('/'));
				SFIDWidget.config.domain = rawDomain;
				SFIDWidget.XAuthServerUrl = SFIDWidget.config.communityURL + "/services/apexrest/widgetserver";
				
			}
			
			var modeTag = document.querySelector('meta[name="salesforce-mode"]');
			if (modeTag != null) {
				SFIDWidget.config.mode = modeTag.content;
				SFIDWidget.handleLoginCallback();
				return;
			} 
			
			
			var client_idTag = document.querySelector('meta[name="salesforce-client-id"]');
			if (client_idTag == null) {
				alert('Specify a meta-tag for salesforce-client-id');
				return;
			} else {
				SFIDWidget.config.client_id = client_idTag.content;
			}
			
			var redirect_uriTag = document.querySelector('meta[name="salesforce-redirect-uri"]');
			if (redirect_uriTag == null) {
				alert('Specify a meta-tag for salesforce-redirect-uri');
				return;
			} else {
				SFIDWidget.config.redirect_uri = redirect_uriTag.content;
			}
	
			
			var targetTag = document.querySelector('meta[name="salesforce-target"]');
			if (targetTag == null) {
				alert('Specify a meta-tag for salesforce-target');
				return;
			} else {
				SFIDWidget.config.target = targetTag.content;
			}
	
			
			var loginHandlerTag = document.querySelector('meta[name="salesforce-login-handler"]');
			if (loginHandlerTag == null) {
				alert('Specify a meta-tag for salesforce-login-handler');
				return;
			} else {
				SFIDWidget_loginHandler = loginHandlerTag.content;
			}
	
	
			if ((SFIDWidget.config.mode == null) || (SFIDWidget.config.mode == 'login')) {
		
				var targetDiv = document.querySelector(SFIDWidget.config.target );
				addButton(targetDiv);
				
			}	
	
		}, login: function() {
			
			if (SFIDWidget.config != null) {
				
				var startURL = SFIDWidget.config.communityURL + '/services/oauth2/authorize?response_type=token&client_id=' + SFIDWidget.config.client_id + '&redirect_uri=' + encodeURIComponent(SFIDWidget.config.redirect_uri) + '&state=' +  encodeURIComponent(SFIDWidget_loginHandler); 
				//window.location = startURL;
				var loginWindow = window.open(startURL,'Login Window','height=580,width=450');
				if (window.focus) {loginWindow.focus()}
				return false;
				
			}
				
			
		}, cancel: function() {
			
			closeLogin();
			
		},  handleLoginCallback: function() {
			
			if (window.location.hash) {
	
				var message = window.location.hash.substr(1);
				var nvps = message.split('&');
				for (var nvp in nvps) {
				    var parts = nvps[nvp].split('=');
				    if (parts[0] == 'id') {
						SFIDWidget.openid = decodeURIComponent(parts[1]);
				    } else if (parts[0] == 'access_token') {
						SFIDWidget.access_token = parts[1];
					} else if (parts[0] == 'state') {
						if (parts[1] != null) SFIDWidget_loginHandler = decodeURIComponent(parts[1]);
					}
				}
				var openidScript = document.createElement('script');
				openidScript.setAttribute('src', SFIDWidget.openid + '?version=latest&callback=SFIDWidget_handleOpenIDCallback&access_token=' + SFIDWidget.access_token);
				document.head.appendChild(openidScript);
	
			}
			
		},  redirectToStartURL: function() {
			if ((SFIDWidget.config.startURL) && (SFIDWidget.config.startURL.toLowerCase().indexOf('http') == 0)) {
				//TODO - this isn't suffifient to prevent openredirects
				alert('To prevent open redirection, you may only use paths for your startURL.');
				return null;
			} else {
				window.location = SFIDWidget.config.startURL;
			}
			
		}
	}

}();

SFIDWidget.init();
