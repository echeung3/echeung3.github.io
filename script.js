let databaseTable, dotphrasesData = [];

$(document).ready(function() {
    // Load JSON data
    fetch('reference_data.json')
        .then(response => response.json())
        .then(data => {
            initializeTables(data);
            return fetch('dotphrases.txt');
        })
        .then(response => response.text())
        .then(text => {
            parseDotphrases(text);
            $('#loading').hide();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            $('#loading').html('<div class="alert alert-danger">Error loading reference data. Please refresh the page.</div>');
        });

    // Tab switching
    $('.tab-button').on('click', function() {
        const section = $(this).data('section');
        $('.tab-button').removeClass('active');
        $(this).addClass('active');
        $('.data-section').removeClass('active');
        $(`#${section}-section`).addClass('active');
        
        // Show/hide table controls based on section
        if (section === 'database') {
            $('#tableControls').show();
        } else {
            $('#tableControls').hide();
        }
    });

    // Column visibility toggles
    $('#showTemplate').on('change', function() {
        const visible = this.checked;
        if (databaseTable) databaseTable.column(1).visible(visible);
    });

    $('#showImgs').on('change', function() {
        const visible = this.checked;
        if (databaseTable) databaseTable.column(2).visible(visible);
    });

    // Dotphrase search
    $('#dotphraseSearch').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        $('.dotphrase-item').each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(searchTerm));
        });
    });

    // Copy button handler
    $(document).on('click', '.copy-btn', function() {
        const text = $(this).siblings('.dotphrase-content').text();
        navigator.clipboard.writeText(text).then(() => {
            const btn = $(this);
            btn.addClass('copied').text('Copied!');
            setTimeout(() => {
                btn.removeClass('copied').text('Copy');
            }, 2000);
        });
    });

    // Image modal handlers
    $('.close-modal').on('click', function() {
        $('#imageModal').hide();
    });

    $('#imageModal').on('click', function(e) {
        if (e.target.id === 'imageModal') {
            $('#imageModal').hide();
        }
    });
});

// Function to open image modal (needs to be global for onclick)
function openImageModal(imageUrl) {
    $('#modalImage').attr('src', imageUrl);
    $('#imageModal').show();
}

function initializeTables(data) {
    // Initialize Database Table
    const databaseData = data.database || [];
    databaseTable = $('#databaseTable').DataTable({
        data: databaseData,
        columns: [
            { data: 'data', defaultContent: '' },
            { data: 'template', defaultContent: '' },
            { data: 'imgs', defaultContent: '' }
        ],
        pageLength: 25,
        order: [],
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Search database..."
        },
        columnDefs: [
            {
                targets: [0, 1], // data and template columns
                render: function(data, type, row) {
                    if (type === 'display' && data) {
                        // Convert URLs to clickable links
                        data = data.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
                        // Preserve line breaks
                        data = data.replace(/\n/g, '<br>');
                    }
                    return data;
                }
            },
            {
                targets: 2, // imgs column
                render: function(data, type, row) {
                    if (type === 'display' && data && data.trim() !== '') {
                        // Split by comma for multiple images
                        const imageUrls = data.split(',').map(url => url.trim()).filter(url => url);
                        
                        if (imageUrls.length > 0) {
                            let html = '<div class="image-container">';
                            imageUrls.forEach(url => {
                                // Check if it's an image URL (has image extension)
                                if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)) {
                                    html += `<img src="${url}" class="reference-image" alt="Reference image" onclick="openImageModal('${url}')" title="Click to enlarge">`;
                                } else {
                                    // If not an image, display as text/link
                                    if (url.startsWith('http')) {
                                        html += `<a href="${url}" target="_blank">${url}</a><br>`;
                                    } else {
                                        html += url.replace(/\n/g, '<br>');
                                    }
                                }
                            });
                            html += '</div>';
                            return html;
                        }
                    }
                    return data ? data.replace(/\n/g, '<br>') : '';
                }
            }
        ]
    });
}

function parseDotphrases(text) {
    const lines = text.split('\n');
    let currentPhrase = null;
    let content = [];

    lines.forEach(line => {
        if (line.startsWith('DOTPHRASE ')) {
            // Save previous phrase if exists
            if (currentPhrase) {
                dotphrasesData.push({
                    title: currentPhrase,
                    content: content.join('\n').trim()
                });
            }
            // Start new phrase
            currentPhrase = line.replace('DOTPHRASE ', '').trim();
            content = [];
        } else if (currentPhrase) {
            content.push(line);
        }
    });

    // Save last phrase
    if (currentPhrase) {
        dotphrasesData.push({
            title: currentPhrase,
            content: content.join('\n').trim()
        });
    }

    // Render dotphrases
    renderDotphrases();
}

function renderDotphrases() {
    const container = $('#dotphrasesContent');
    container.empty();

    dotphrasesData.forEach((phrase, index) => {
        const item = $('<div class="dotphrase-item mb-3"></div>');
        
        const title = $(`<div class="dotphrase-title d-flex justify-content-between align-items-center">
            <span><i class="fas fa-file-medical me-2"></i>${phrase.title}</span>
            <button class="btn btn-sm btn-primary copy-btn">Copy</button>
        </div>`);
        
        const content = $(`<div class="dotphrase-content">${phrase.content}</div>`);
        
        item.append(title).append(content);
        container.append(item);
    });
}
