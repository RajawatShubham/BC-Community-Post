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

    function showSuccess() {
        elements.loginButton.innerHTML = '<span class="loading"></span> Signing In...';

        LoginSuccess();

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

        if (username === '10' && password === 'qwer') {
            showSuccess();
        } else {
            showError('Invalid username or password');
        }
    }

    // Attach events
    elements.togglePassword.onclick = togglePasswordVisibility;
    elements.loginButton.onclick = handleLogin;

    console.log("Login form initialized.");
}


function LoginSuccess() {
    // Handle login success actions here

    // Microsoft.Dynamics.NAV.InvokeExtensibilityMethod("OnLogin", []);
    // window.top.NAVBridge.Invoke("OnLogin", []);

    window.parent.postMessage({ type: 'ToBC', method: 'OnLogin', args: [] }, '*');


    // // Notify BC from inside iframe: prefer parent.NAVBridge, fallback to postMessage
    // try {
    //     if (window.parent && window.parent.NAVBridge) {
    //         window.parent.NAVBridge.invoke("OnLogin", []);
    //     } else if (window.parent) {
    //         window.parent.postMessage({ type: 'ToBC', method: 'OnLogin', args: [] }, '*');
    //     }
    // } catch (e) {
    //     console.error('Failed to signal OnLogin to BC:', e);
    // }
}

