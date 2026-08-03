// Initialize Supabase client (already done in index.html)
// Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set correctly in index.html

// Handle Login
async function handleLogin(event) {
  event.preventDefault(); // prevent page reload

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const { data, error } = await _supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
      return;
    }

    console.log("Login successful:", data);
    alert("Login successful!");

    // Show dashboard section
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("menu-section").style.display = "block";
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Unexpected error occurred. Check console for details.");
  }
}

// Handle Sign Up
async function handleSignUp(event) {
  event.preventDefault();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;

  if (password.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const { data, error } = await _supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Sign Up failed:", error.message);
      alert("Sign Up failed: " + error.message);
      return;
    }

    const user = data.user;

    // Collect profile info
    const role = document.getElementById("signup-role").value;
    const profile = {
      id: user.id,
      full_name: document.getElementById("signup-fullname").value,
      email,
      phone: document.getElementById("signup-phone").value,
      ghana_card: document.getElementById("signup-ghana-card").value,
      role,
      business_name: role === "vendor" ? document.getElementById("signup-business-name").value : null,
      business_location: role === "vendor" ? document.getElementById("signup-business-location").value : null,
      food_type: role === "vendor" ? document.getElementById("signup-food-type").value : null,
    };

    // Insert into profiles table
    const { error: insertError } = await _supabase.from("profiles").insert(profile);
    if (insertError) {
      console.error("Profile save failed:", insertError.message);
      alert("Profile save failed: " + insertError.message);
      return;
    }

    alert("Sign Up successful! Profile saved.");
    console.log("Profile saved:", profile);
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Unexpected error occurred. Check console for details.");
  }
}

// Handle Forgot Password
async function handleForgotPassword() {
  const email = prompt("Enter your email to reset password:");
  if (!email) return;

  try {
    const { error } = await _supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error("Reset failed:", error.message);
      alert("Reset failed: " + error.message);
    } else {
      alert("Password reset email sent!");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Unexpected error occurred. Check console for details.");
  }
}
