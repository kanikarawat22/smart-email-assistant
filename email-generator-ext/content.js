console.log("Email Generator Extension - Content Script Loaded");


function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}
function getEmailContent() {
    const selectors = [
        // Targets the main view area that contains the email thread
        '.nH.hx .h7', 
        
        // General body content selector
        '.a3s.aiL', 
        
        // Targets the container that holds the original email body
        'div[role="listitem"] .a3s' 
    ];

    let bestContent = '';

    for(const selector of selectors) {
        // Use querySelectorAll to check all potential matches
        const contents = document.querySelectorAll(selector);
        
        // Loop backwards to find the LATEST message first
        for(let i = contents.length - 1; i >= 0; i--) {
            const contentElement = contents[i];
            
            // CRITICAL CHECK 1: Skip if the element is part of the quoted reply history (the previous emails)
            if (contentElement.closest('.gmail_quote') || contentElement.closest('.aDh')) {
                continue; 
            }
            
            // CRITICAL CHECK 2: Skip signature blocks
            if (contentElement.closest('.gmail_signature')) {
                continue; 
            }
            
            // Get the text and clean it up
            const text = contentElement.innerText.trim();

            // Return the first valid, non-quoted, non-empty block found
            if(text.length > 20 && !text.toLowerCase().includes('forwarded message')) {
                bestContent = text;
                return bestContent; // Found the best match, exit immediately
            }
        }
    }
    
    return bestContent; 
}


function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for(const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if(toolbar) {
            return toolbar;
        }
    }
    // FIX 3: Only return null if ALL selectors fail.
    return null;
}


function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if(existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if(!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button");
    const Button = createAIButton(); // Defined as 'Button'
    Button.classList.add('ai-reply-button');

    Button.addEventListener('click', async () => {
        try {
            // FIX 1: Changed 'button' to 'Button'
            Button.innerHTML = 'Generating....';
            Button.disabled = true;

            const emailContent = getEmailContent();
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })

            });

            if(!response.ok) {
                throw new Error('API Request Failed');
            }

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role = "textbox"][g_editable="true"]');

            if(composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error('ComposeBox was not found');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate reply');
        } finally  {
            // FIX 1: Changed 'button' to 'Button'
            Button.innerHTML = 'AI Reply';
            Button.disabled = false;
        }


    });

    toolbar.insertBefore(Button, toolbar.firstChild);

}

const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        
        // This MutationObserver logic is already correct
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE && (
                node.matches('.aDh, .btC, [role="dialog"]') || 
                node.querySelector('.aDh, .btC, [role="dialog"]')
            )
        );

        if(hasComposeElements) {
            console.log("Compose Window Detected");
            setTimeout(injectButton, 500); 
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});