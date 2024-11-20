document.getElementById("markdown-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const blogName = document.getElementById("blog-name").value;
    const markdownFile = document.getElementById("markdown-file").files[0];
    const resultDiv = document.getElementById("result");

    if (!blogName || !markdownFile) {
        resultDiv.innerHTML = `<div class="alert alert-danger">Blog name and file are required!</div>`;
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const markdownContent = e.target.result;
        // Convert Markdown to HTML using markdown-it
        const md = window.markdownit({
            html: true,        // Enable HTML tags in source
            linkify: true,     // Autoconvert URLs into clickable links
            typographer: true, // Enable smart quotes and typography
        });
        const htmlContent = md.render(markdownContent);

        // Load the template
        fetch("../blogs/blog_html_template.html")
            .then((response) => response.text())
            .then((template) => {
                // Replace placeholders with actual content
                const blogHtml = template
                    .replace("{{title}}", blogName)
                    .replace("{{blog_breadcrum}}", blogName)
                    .replace("{{content}}", htmlContent);

                // Create a Blob for the generated HTML file
                const blob = new Blob([blogHtml], { type: "text/html" });
                const url = URL.createObjectURL(blob);

                // Create a download link
                const downloadLink = document.createElement("a");
                downloadLink.href = url;
                downloadLink.download = `${blogName}.html`;
                downloadLink.innerText = "Download Blog";
                downloadLink.classList.add("btn", "btn-success");

                resultDiv.innerHTML = "";
                resultDiv.appendChild(downloadLink);
            })
            .catch((error) => {
                console.error("Error loading template:", error);
                resultDiv.innerHTML = `<div class="alert alert-danger">Failed to load template.</div>`;
            });
    };

    reader.readAsText(markdownFile);
});
