import { AuthService, IUserInfo } from '@signature/webfrontauth';
import axios from 'axios';
import { create } from 'domain';

//Initialize a new auth service
let identityEndPoint = {
  hostname: 'localhost',
  port: 5001,
  disableSsl: true
}

//Create an event trigger on auth change
const onAuthChange: (e: AuthService<IUserInfo>) => void = (e) => {
  showAuthInfo();
}

let authService: AuthService<IUserInfo>|undefined = undefined;

async function refresh(full?: boolean, requestSchemes?: boolean, requestVersion?: boolean) {
  if(authService) {
    authService.refresh(full, requestSchemes, requestVersion);
  }
}

async function startPopupLogin(scheme: string, rememberMe?: boolean, userData?: { [index: string]: any; } ) {
  if(authService) {
    authService.startPopupLogin(scheme, rememberMe, userData);
  }
}

async function startInlineLogin(scheme: string, returnUrl: string, rememberMe?: boolean, userData?: { [index: string]: any; }) {
  debugger
  if(authService) {
    authService.startInlineLogin(scheme, returnUrl, rememberMe, userData);
  }
}

async function basicLogin(userName: string, password: string, rememberMe?: boolean, userData?: { [index: string]: any; }) {
  debugger
  if(authService) {
  authService.basicLogin(userName, password, rememberMe, userData);
  }
}

async function logout( full?: boolean ) {
  if(authService) {
    authService.logout(full);
  }
}

async function impersonate(user: string|number) {
  debugger
  if(authService) {
    authService.impersonate(user);
  }
}

async function unsafeDirectLogin(provider: string, payload?: { [index: string]: any; }, rememberMe?: boolean) {
  debugger
  if(authService) {
    authService.unsafeDirectLogin(provider, payload, rememberMe)
  }
}

async function editEndPoint(newIdentityEndPoint: any) {
  identityEndPoint = newIdentityEndPoint; 
  authService.removeOnChange(onAuthChange);
  authService = await AuthService.createAsync(
    {
      identityEndPoint 
    },
    axios.create()
  )
  authService.addOnChange(onAuthChange);
  showAuthInfo();
}

//Build html to display auth info
async function showAuthInfo () {
  if(authService) {
    //Check if auth info are already displayed
    if (document.getElementById("authInfo") != null) {
      //Remove displayed auth info
      document.getElementById("authInfo").remove();
    }
    if (document.getElementById("endpointInfo") != null) {
      //Remove displayed auth info
      document.getElementById("endpointInfo").remove();
    }
    //Get element to fill
    const state = document.getElementById("state");
    const endpoint = document.getElementById("endpoint");
    //Create html element
    const newDiv = document.createElement("pre");
    const endpointPre = document.createElement("pre");
    //Set properties for created pre
    newDiv.id = "authInfo";
    newDiv.className = "state-item";
    newDiv.style.textAlign = "initial";
    endpointPre.id = "endpointInfo";
    endpointPre.className = "state-item";
    endpointPre.style.textAlign = "initial";
    //Create some nodes to fill the created element
    const authInfo = document.createTextNode("authentication info: \n"+JSON.stringify(authService.authenticationInfo, undefined, 2)
                                            +"\n\n Token: \n"+JSON.stringify(authService.token)
                                            +"\n\n Refreshable: \n"+JSON.stringify(authService.refreshable, undefined, 2)
                                            +"\n\n RememberMe: \n"+JSON.stringify(authService.rememberMe, undefined, 2)
                                            +"\n\n AvailableSchemes: \n"+JSON.stringify(authService.availableSchemes, undefined, 2) );
    //Create the endpoint section                                       
    let hostnameInput = document.createElement("input");
    hostnameInput.value = identityEndPoint.hostname;
    let portInput = document.createElement("input");
    portInput.value = identityEndPoint.port.toString();
    let sslInput = document.createElement("input");
    sslInput.value = identityEndPoint.disableSsl.toString();
    let editButton = document.createElement('button');
    editButton.textContent = "Edit";
    editButton.style.textAlign = "center";
    editButton.onclick = async () => {
      await editEndPoint({
        hostname: hostnameInput.value,
        port: portInput.value,
        disableSsl: sslInput.value
      })
    };
    let editButtonDiv = document.createElement('div');
    editButtonDiv.style.display = 'flex';
    editButtonDiv.style.width = '100%';
    editButtonDiv.style.justifyContent = 'flex-end';
    //Add the created nodes
    newDiv.appendChild(authInfo);
    state.appendChild(newDiv);
    endpoint.appendChild(endpointPre);
    endpointPre.appendChild(document.createTextNode(`{\n`));
    endpointPre.appendChild(document.createTextNode('  "hostname": '));
    endpointPre.appendChild(hostnameInput);
    endpointPre.appendChild(document.createTextNode('\n  "port": '));
    endpointPre.appendChild(portInput);
    endpointPre.appendChild(document.createTextNode('\n  "disableSsl": '));
    endpointPre.appendChild(sslInput);
    endpointPre.appendChild(document.createTextNode('\n}\n\n'));
    endpointPre.appendChild(editButtonDiv);
    editButtonDiv.appendChild(editButton);
  }
}

AuthService.createAsync(
  {
    identityEndPoint
  },
  axios.create()
).then((newAuthService) => {
  authService = newAuthService;
  authService.addOnChange(onAuthChange);
  showAuthInfo();
});

export default {
  refresh,
  startPopupLogin,
  startInlineLogin,
  basicLogin,
  logout,
  impersonate,
  unsafeDirectLogin,
  showAuthInfo,
  editEndPoint
};