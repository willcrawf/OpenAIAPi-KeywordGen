document.getElementById('generate-button').addEventListener('click', () => {
    // Hide the input and button during loading
    document.getElementById('keyword-input').disabled = true;
    document.getElementById('generate-button').disabled = true;
    document.getElementById('clear-button').disabled = true; // Disable the clear button
    // Show the loading message and icon
    document.getElementById('loading-message').style.display = 'block';
    document.getElementById('loading-icon').style.display = 'block';
    // Hide the generate button and show the cancel button
    document.getElementById('generate-button').style.display = 'none';
    document.getElementById('cancel-button').style.display = 'inline-block';
    // Create an AbortController
    const abortController = new AbortController();
    // Attach the AbortController's signal to the Fetch request
    const inputKeywords = document.getElementById('keyword-input').value.split(',').map(keyword => keyword.trim());
    fetch(`/generateKeywords?keywords=${inputKeywords.join(',')}`, {
      method: 'GET',
      signal: abortController.signal, // Attach the AbortController's signal
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else if (response.statusText === 'AbortError') {
        throw new Error('Request was cancelled');
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    })
    .then(data => {
      // Display the keywords as a single comma-separated string
      const keywordList = document.getElementById('keyword-list');
      keywordList.textContent = data.trim(); // Set the text content directly
      // Show the copy to clipboard button after generating keywords
      document.getElementById('copy-button').style.display = 'inline-block';
      // Hide the loading message and icon, and re-enable input and button
      document.getElementById('loading-message').style.display = 'none';
      document.getElementById('loading-icon').style.display = 'none';
      document.getElementById('keyword-input').disabled = false;
      document.getElementById('cancel-button').style.display = 'none'; // Hide the cancel button
      document.getElementById('generate-button').style.display = 'inline-block'; // Show the generate button again
      document.getElementById('generate-button').disabled = false;
      document.getElementById('clear-button').disabled = false; // Enable the clear button
    })
    .catch(error => {
      console.error('Error:', error);
      // Hide the loading message and icon, and re-enable input and button in case of an error
      document.getElementById('loading-message').style.display = 'none';
      document.getElementById('loading-icon').style.display = 'none';
      document.getElementById('keyword-input').disabled = false;
      document.getElementById('generate-button').style.display = 'inline-block'; // Show the generate button again
      document.getElementById('generate-button').disabled = false;
      document.getElementById('cancel-button').style.display = 'none'; // Hide the cancel button
      document.getElementById('clear-button').disabled = false; // Enable the clear button
    });

    // Add an event listener to the cancel button
    document.getElementById('cancel-button').addEventListener('click', () => {
      // Cancel the API request by aborting it
      abortController.abort();
      // Hide the loading message and icon, and re-enable input and button
      document.getElementById('loading-message').style.display = 'none';
      document.getElementById('loading-icon').style.display = 'none';
      document.getElementById('keyword-input').disabled = false;
      document.getElementById('generate-button').style.display = 'inline-block'; // Show the generate button again
      document.getElementById('generate-button').disabled = false;
      document.getElementById('cancel-button').style.display = 'none'; // Hide the cancel button
      document.getElementById('clear-button').disabled = false; // Enable the clear button
    });

    // Add an event listener to the clear button
    document.getElementById('clear-button').addEventListener('click', () => {
      // Clear the input text
      document.getElementById('keyword-input').value = '';
      // Clear the response text
      const keywordList = document.getElementById('keyword-list');
      keywordList.textContent = '';
      // Hide the copy to clipboard button
      document.getElementById('copy-button').style.display = 'none';
    });

    // Add an event listener to the copy to clipboard button
    document.getElementById('copy-button').addEventListener('click', () => {
      // Copy the generated keywords to the clipboard
      const keywords = document.getElementById('keyword-list').textContent;
      const dummy = document.createElement('textarea');
      document.body.appendChild(dummy);
      dummy.value = keywords;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      // Show a message indicating that the keywords are copied
      alert('Keywords copied to clipboard!');
    });
  });