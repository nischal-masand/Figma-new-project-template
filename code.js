figma.showUI(__html__, { width: 600, height: 750 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-template') {
    try {
      figma.notify('Creating template pages...');

      // Delete existing pages except the first one
      while (figma.root.children.length > 1) {
        figma.root.children[figma.root.children.length - 1].remove();
      }

      // Get selected pages
      const pages = msg.pages;

      // Rename first page to first template page name
      figma.root.children[0].name = pages[0];

      // Create remaining pages
      for (let i = 1; i < pages.length; i++) {
        const newPage = figma.createPage();
        newPage.name = pages[i];  // Creates pages with "---" name for dividers
      }

      // Create cover page content
      const coverPage = figma.root.children[0];
      figma.currentPage = coverPage;

      // Create frame for cover page
      const frame = figma.createFrame();
      frame.resize(1920, 1080);
      frame.x = 0;
      frame.y = 0;
      frame.name = "Cover Frame";

      // Create cover text
      const text = figma.createText();
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });

      text.characters = "Project Template";
      text.x = (1920 - text.width) / 2; // Center horizontally in frame
      text.y = (1080 - text.height) / 2 - 50; // Center vertically in frame with offset
      text.fontSize = 64;
      text.textAlignHorizontal = "CENTER";
      text.textAlignVertical = "CENTER";

      // Add date to cover
      const dateText = figma.createText();
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });

      const today = new Date();
      dateText.characters = today.toLocaleDateString();
      dateText.fontSize = 24;
      dateText.textAlignHorizontal = "CENTER";
      dateText.textAlignVertical = "CENTER";

      // Position date text after main text is created
      dateText.x = (1920 - dateText.width) / 2; // Center horizontally in frame
      dateText.y = text.y + text.height + 20; // Place below main text

      // Add text elements to frame
      frame.appendChild(text);
      frame.appendChild(dateText);

      // Success notification
      const actualPageCount = pages.filter(page => page !== "---").length;
      figma.notify(`Created template with ${actualPageCount} pages`);

    } catch (error) {
      console.error('Error creating template:', error);
      figma.notify('Error creating template: ' + error.message, { error: true });
    }
  }

  // Close the plugin after a short delay
  setTimeout(() => {
    figma.closePlugin();
  }, 1000);
};