document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const convertBtn = document.getElementById('convertBtn');
    const converterForm = document.getElementById('converterForm');
    
    // File upload area interactions
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadArea.classList.add('dragover');
    }
    
    function unhighlight() {
        uploadArea.classList.remove('dragover');
    }
    
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        fileInput.files = files;
        handleFileSelect();
    }
    
    function handleFileSelect() {
        const file = fileInput.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
            if (!validTypes.includes(file.type)) {
                showError('Please select a valid image file (JPG, PNG, WEBP, GIF, BMP)');
                resetFileInput();
                return;
            }
            
            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                showError('File size must be less than 10MB');
                resetFileInput();
                return;
            }
            
            displayFileInfo(file);
        }
    }
    
    function displayFileInfo(file) {
        const fileSize = (file.size / (1024 * 1024)).toFixed(2);
        fileInfo.innerHTML = `
            <strong>Selected:</strong> ${file.name}<br>
            <strong>Size:</strong> ${fileSize} MB<br>
            <strong>Type:</strong> ${file.type.split('/')[1].toUpperCase()}
        `;
        fileInfo.style.display = 'block';
        
        // Add success styling
        uploadArea.style.borderColor = '#10b981';
        uploadArea.style.background = '#f0fdf4';
    }
    
    function resetFileInput() {
        fileInput.value = '';
        fileInfo.style.display = 'none';
        fileInfo.innerHTML = '';
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';
    }
    
    function showError(message) {
        // Create temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;
        
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        converterForm.parentNode.insertBefore(errorDiv, converterForm);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    // Form submission handling
    converterForm.addEventListener('submit', function(e) {
        const file = fileInput.files[0];
        if (!file) {
            e.preventDefault();
            showError('Please select a file to convert');
            return;
        }
        
        // Show loading state
        convertBtn.classList.add('loading');
        convertBtn.disabled = true;
        
        // Add a small delay to show the loading state
        setTimeout(() => {
            convertBtn.classList.remove('loading');
            convertBtn.disabled = false;
        }, 3000); // Reset after 3 seconds (in case submission fails)
    });
    
    // Add some interactive animations
    const formatSelect = document.getElementById('formatSelect');
    formatSelect.addEventListener('focus', () => {
        formatSelect.parentElement.style.transform = 'scale(1.02)';
    });
    
    formatSelect.addEventListener('blur', () => {
        formatSelect.parentElement.style.transform = 'scale(1)';
    });
    
    // Add confetti effect on successful conversion (if you want to add it later)
    window.showSuccess = function() {
        // This can be implemented later when you add success feedback
        console.log('Conversion successful!');
    };
    
    // Initialize tooltips or other UI enhancements
    console.log('FileCon Magic Converter initialized! 🪄');
});