document.getElementById('activateButton').onclick = function() {
    var videoFeed = document.getElementById('videoFeed');
    videoFeed.style.display = "block";  // Show the video feed
    document.getElementById('snapshotBtn').style.display = "inline";
    this.style.display = "none";  // Hide the activate button
};

document.getElementById('snapshotBtn').onclick = function(){
    fetch ('/take_snapshot', {method: 'POST'})
        .then(response => {
            if(response.ok){
                return response.text();
            }
            throw new Error('Request failed.');
        })
        .then(data => alert("Snapshot taken!"))
        .catch(error => console.error(error));
};

document.getElementById('loadImagesButton').addEventListener('click', function(){
    fetch('/get-images')
        .then(response => response.json())
        .then(images => {
            const container = document.getElementById('imageContainer');
            container.innerHTML = '';
            images.forEach(img => {
                const imgElement = document.createElement('img');
                imgElement.src = `/images/${img}`;
                imgElement.style.width = '100px';
                imgElement.style.cursor = 'pointer';
                imgElement.onclick = function(){
                    document.getElementById('modalContent').src = imgElement.src;
                    document.getElementById('imageModal').style.display = 'block';
                };

                // Add event listener for image deletion
                imgElement.addEventListener('contextmenu', function(event) {
                    event.preventDefault();
                    // Prompt user for confirmation before deleting the image
                    if (confirm("Are you sure you want to delete this image?")) {
                        // Send request to delete image
                        fetch(`/delete-image/${img}`, {method: 'DELETE'})
                            .then(response => {
                                if (response.ok) {
                                    // Reload images after deletion
                                    document.getElementById('loadImagesButton').click();
                                } else {
                                    throw new Error('Failed to delete image');
                                }
                            })
                            .catch(error => console.error('Error deleting image:', error));
                    }
                });

                container.appendChild(imgElement);
            });
        })
        .catch(error => console.error('Error loading images:', error));

    document.getElementById('closeModal').onclick = function(){
        document.getElementById('imageModal').style.display = 'none';
    };
});

document.getElementById('snapshotBtn').addEventListener('click', function() {
    var video = document.getElementById('videoFeed'); // Your video feed element
    var canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function(blob) {
        var formData = new FormData();
        formData.append('snapshot', blob, 'snapshot.jpg');

        fetch('/take_snapshot', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }, 'image/jpeg');
});

