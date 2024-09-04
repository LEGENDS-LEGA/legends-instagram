document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/saveData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ username, password }),
    }).then(response => response.text())
      .then(text => alert(text))
      .catch(error => {
          console.error('Սխալ:', error);
          alert('Սխալ, չհաջողվեց պահպանել տվյալները');
      });
});
