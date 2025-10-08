(function () {
    // Expose globally so BC can call it if needed
    window.RenderLoginForm = function () {
        InitLoginForm();
    };

    // Run automatically on DOM load
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", window.RenderLoginForm);
    } else {
        window.RenderLoginForm();
    }
})();


function InitLoginForm() {
    const elements = {
        loginButton: document.getElementById('login-button'),
        usernameInput: document.getElementById('username-input'),
        passwordInput: document.getElementById('password-input'),
        errorMessage: document.getElementById('error-message'),
        successMessage: document.getElementById('success-message'),
        togglePassword: document.getElementById('togglePassword')
    };

    // If elements are missing, exit gracefully
    if (!elements.loginButton || !elements.usernameInput || !elements.passwordInput) {
        console.warn("Login form elements not found yet.");
        return;
    }

    function togglePasswordVisibility() {
        const type = elements.passwordInput.type === 'password' ? 'text' : 'password';
        elements.passwordInput.type = type;
        elements.togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    }

    function resetFormState() {
        elements.errorMessage.style.display = 'none';
        elements.successMessage.style.display = 'none';
        elements.usernameInput.classList.remove('error');
        elements.passwordInput.classList.remove('error');
        elements.loginButton.innerHTML = 'Sign In';
        elements.loginButton.classList.remove('success');
    }

    function showError(message) {
        elements.errorMessage.textContent = message;
        elements.errorMessage.style.display = 'block';
        elements.usernameInput.classList.add('error');
        elements.passwordInput.classList.add('error');
    }

    function showSuccess(username,password) {
        elements.loginButton.innerHTML = '<span class="loading"></span> Signing In...';

        LoginSuccess(username,password);

        setTimeout(() => {
            elements.loginButton.innerHTML = 'Success';
            elements.loginButton.classList.add('success');
            elements.successMessage.textContent = 'Login successful!';
            elements.successMessage.style.display = 'block';
        }, 1000);
    }

    function handleLogin() {
        const username = elements.usernameInput.value.trim();
        const password = elements.passwordInput.value.trim();

        resetFormState();

        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }

        // if (!showSuccess(username, password)) {
        //     showError('Invalid username or password');
        // }

        if (username === JsonData.username && password === JsonData.password) {
            showSuccess(username,password);
        } else {
            showError('Invalid username or password');
        }
    }

    // Attach events
    elements.togglePassword.onclick = togglePasswordVisibility;
    elements.loginButton.onclick = handleLogin;

    console.log("Login form initialized.");

    // Prevent escape to BC until success
    PreventEscape();
}


function LoginSuccess(username,password)
{
    // Handle login success actions here

    //  const terminalId = getParam('terminalId');
    const terminalId = GetQueryParam('terminalId');

    const logindata = {
        "event": "OnLogin",
        "terminalId": terminalId,
        "username": username,
        "password": password
    };

    // Notify BC from inside iframe: prefer parent.NAVBridge, fallback to postMessage
    JS2AL(logindata);

    // window.parent.NAVBridge.Invoke("OnLogin", [terminalId, username,password]);

    // Send message to parent window (the add-in window that has NAVBridge)
    // window.parent.postMessage({
    //     type: 'ToBC',
    //     method: 'OnLogin',
    //     args: [terminalId, username, password]
    // }, '*');

    // alert('Unrendering POS iframe and cleaning up.');

}

// ============================================================================
// STEP 3: Prevent user from escaping login screen
// ============================================================================
function PreventEscape() {
    // Disable F5 / Ctrl+R reload
    window.addEventListener('keydown', (e) => {
        if ((e.key === 'F5') || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
            e.preventDefault();
            e.stopPropagation();
        }
        // Block Esc key closing fullscreen
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    // Disable right-click context menu
    window.addEventListener('contextmenu', (e) => e.preventDefault(), true);
}

// ============================================================================
// STEP 4: Called after login validation
// ============================================================================
window.OnLoginSuccess = function () {
    // Cleanup login overlay/iframe
    Unrender();

    // Allow BC shell again
    restoreHostStyles();

    // Remove escape restrictions
    window.removeEventListener('keydown', PreventEscape, true);
    window.removeEventListener('contextmenu', (e) => e.preventDefault(), true);
};
