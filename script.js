let databaseTable, dotphrasesData = [];

function initTable() {
  console.log("initTable loaded");
  // your table / data render logic here
}


document.addEventListener("DOMContentLoaded", () => {
  try {
    if (typeof initTable === "function") initTable();
    if (typeof initSearch === "function") initSearch();
    if (typeof initCopy === "function") initCopy();
  } catch (e) {
    console.error("Init failed:", e);
  }
});

$(function () {
  // your handlers here
});


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

    // Password-protected document section
    const DOCUMENT_PASSWORD = 'ElaineHW'; // Change this to your desired password
    const GOOGLE_DOC_URL = 'https://docs.google.com/document/d/1WjCufPfBqED1K548Y7Fw_O8Mi1ddv4bJ53vzJCzkmco/edit?usp=sharing'; // Replace with your Google Doc embed URL

    $('#submit-password').on('click', function() {
        const enteredPassword = $('#doc-password').val();
        if (enteredPassword === DOCUMENT_PASSWORD) {
            $('#password-error').hide();
            $('#password-gate').hide();
            $('#document-container').show();
            $('#google-doc-frame').attr('src', GOOGLE_DOC_URL);
            $('#doc-password').val('');
        } else {
            $('#password-error').show();
            $('#doc-password').val('').focus();
        }
    });

    // Allow Enter key to submit password
    $('#doc-password').on('keypress', function(e) {
        if (e.which === 13) {
            $('#submit-password').click();
        }
    });

    // Lock document button
    $('#lock-document').on('click', function() {
        $('#document-container').hide();
        $('#password-gate').show();
        $('#google-doc-frame').attr('src', '');
        $('#doc-password').val('');
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
        const btn = $(this);
        const text = btn.closest('.dotphrase-item').find('.dotphrase-content').text();
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                btn.addClass('copied').text('Copied!');
                setTimeout(() => {
                    btn.removeClass('copied').text('Copy');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                alert('Failed to copy to clipboard. Please try again.');
            });
        } else {
            // Fallback for browsers that don't support clipboard API
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                btn.addClass('copied').text('Copied!');
                setTimeout(() => {
                    btn.removeClass('copied').text('Copy');
                }, 2000);
            } catch (err) {
                console.error('Fallback copy failed:', err);
                alert('Failed to copy to clipboard. Please try again.');
            }
            document.body.removeChild(textarea);
        }
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

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatCellContent(text) {
    const escaped = escapeHtml(text);
    const withLinks = escaped.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    return withLinks.replace(/\n/g, '<br>');
}

function markdownTableToHtml(markdown) {
    const lines = markdown
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);

    if (lines.length < 2) return null;

    const headerLine = lines[0];
    const separatorLine = lines[1];

    const isTable = headerLine.startsWith('|') && headerLine.endsWith('|') &&
        /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(separatorLine);

    if (!isTable) return null;

    const splitRow = (row) => row
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(cell => cell.trim());

    const headers = splitRow(headerLine);
    const bodyRows = lines.slice(2).map(splitRow);

    let html = '<div class="table-responsive"><table class="table table-bordered table-sm markdown-table">';
    html += '<thead><tr>' + headers.map(h => `<th>${formatCellContent(h)}</th>`).join('') + '</tr></thead>';
    html += '<tbody>';
    bodyRows.forEach(row => {
        html += '<tr>' + row.map(cell => `<td>${formatCellContent(cell)}</td>`).join('') + '</tr>';
    });
    html += '</tbody></table></div>';
    return html;
}

function renderCellContent(data, type) {
    if (type === 'display' && data) {
        const tableHtml = markdownTableToHtml(data);
        if (tableHtml) return tableHtml;
        return formatCellContent(data);
    }
    return data;
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
                    return renderCellContent(data, type);
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

   const dataDiv = document.getElementById("condition-data");
    if (dataDiv) dataDiv.textContent = ""; // or set to a default message
}

