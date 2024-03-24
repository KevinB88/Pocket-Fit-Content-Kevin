// search.js
document.getElementById('searchButton').addEventListener('click', performSearch);

function performSearch() {
    var query = document.getElementById('query').value;
    var apiKey = 'AIzaSyCoRN-TZK_hMwmtJxJNKvYCctrPsIbsNNA'; // Replace with your actual API key
    var cx = 'c4935a753bc6648eb'; // Replace with your actual search engine ID
    var url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            var html = '';
            data.items.forEach(item => {
                html += `<div><h3><a href="${item.link}">${item.title}</a></h3><p>${item.snippet}</p></div>`;
            });
            document.getElementById('results').innerHTML = html;
        })
        .catch(error => console.error('Error:', error));
}
