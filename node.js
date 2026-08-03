async function login(username, password) {
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    const data = await response.json();
    console.log('Login success:', data);
  } catch (err) {
    console.error('Login failed:', err.message);
  }
}
