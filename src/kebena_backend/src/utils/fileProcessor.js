const pdfParse = require('pdf-parse');
const officeParser = require('officeparser');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

/**
 * Extract text content from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<Array>} Array of slide content
 */
async function extractPDFContent(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    
    // Split content by pages (approximate)
    // PDF parser gives us full text, we need to intelligently split it
    const fullText = data.text;
    
    // Split by double line breaks or page breaks
    const slides = fullText
      .split(/\n\n+/)
      .map(slide => slide.trim())
      .filter(slide => slide.length > 0);

    // If no clear breaks, split by number of pages
    if (slides.length < 2 && data.numpages > 1) {
      const textPerPage = Math.ceil(fullText.length / data.numpages);
      const tempSlides = [];
      
      for (let i = 0; i < data.numpages; i++) {
        const start = i * textPerPage;
        const end = start + textPerPage;
        const pageText = fullText.substring(start, end).trim();
        if (pageText) {
          tempSlides.push(pageText);
        }
      }
      
      return tempSlides.length > 0 ? tempSlides : slides;
    }

    return slides.length > 0 ? slides : ['No text content extracted from PDF'];

  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract PDF content: ${error.message}`);
  }
}

/**
 * Extract text content from PPT/PPTX file
 * @param {string} filePath - Path to PowerPoint file
 * @returns {Promise<Array>} Array of slide content
 */
async function extractPPTContent(filePath) {
  try {
    // Verify file exists and is readable
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      throw new Error('File not found or is not a valid file');
    }

    console.log(`📄 Processing PowerPoint file: ${path.basename(filePath)} (${stats.size} bytes)`);

    // Extract text using officeparser
    const text = await officeParser.parseOfficeAsync(filePath);
    
    if (!text || text.trim().length === 0) {
      console.warn('⚠️ No text content found in PowerPoint file');
      return ['No text content found in file. Please add slides manually.'];
    }

    console.log(`📝 Extracted text length: ${text.length} characters`);
    console.log('📄 First 200 characters:', text.substring(0, 200) + '...');

    // Strategy 1: Split by multiple newlines (most common slide separator)
    let slides = text
      .split(/\n{3,}/) // Split by 3+ newlines (slide breaks)
      .map(slide => slide.trim())
      .filter(slide => slide.length > 10); // Filter out very short content

    console.log(`✅ Strategy 1: Found ${slides.length} slides by newline breaks`);

    // Strategy 2: If no clear slide breaks, try double newlines
    if (slides.length < 2) {
      slides = text
        .split(/\n\n+/)
        .map(slide => slide.trim())
        .filter(slide => slide.length > 10);
      
      console.log(`✅ Strategy 2: Found ${slides.length} slides by double newlines`);
    }

    // Strategy 3: If still not enough slides, split by numbered patterns (Slide 1, 1., etc.)
    if (slides.length < 2) {
      const slidePattern = /(?:Slide\s+\d+|^\d+\.|^Verse\s+\d+|^Chorus)/gim;
      const matches = text.split(slidePattern);
      
      if (matches.length > 1) {
        slides = matches
          .map(slide => slide.trim())
          .filter(slide => slide.length > 10);
        
        console.log(`✅ Strategy 3: Found ${slides.length} slides by pattern matching`);
      }
    }

    // Strategy 4: Split by every 6-10 lines as last resort
    if (slides.length < 2) {
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      const slidesFromLines = [];
      let currentSlide = [];
      
      for (let i = 0; i < lines.length; i++) {
        currentSlide.push(lines[i]);
        
        // Create new slide every 6-8 lines or at the end
        if (currentSlide.length >= 7 || i === lines.length - 1) {
          if (currentSlide.length > 0) {
            slidesFromLines.push(currentSlide.join('\n'));
            currentSlide = [];
          }
        }
      }
      
      if (slidesFromLines.length > 0) {
        slides = slidesFromLines;
        console.log(`✅ Strategy 4: Found ${slides.length} slides by line count`);
      }
    }

    // Clean up slides: remove excessive whitespace
    slides = slides.map(slide => {
      // Replace multiple spaces with single space
      // Keep newlines for verse structure
      return slide
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
    });

    console.log(`✅ Successfully extracted ${slides.length} slides from PowerPoint`);
    
    if (slides.length === 0) {
      return ['No slides could be extracted. Please add content manually.'];
    }
    
    return slides;

  } catch (error) {
    console.error('❌ PPT extraction error:', error);
    
    // Provide specific error messages
    if (error.message.includes('ENOENT')) {
      throw new Error('File not found. Please try uploading again.');
    } else if (error.message.includes('EACCES')) {
      throw new Error('Permission denied. Cannot read file.');
    } else if (error.message.includes('unsupported')) {
      throw new Error('File format not supported. Please use PPT or PPTX files.');
    }
    
    throw new Error(`Failed to extract PowerPoint content: ${error.message}`);
  }
}

/**
 * Process uploaded file and extract content
 * @param {string} filePath - Path to uploaded file
 * @param {string} fileType - Type of file (pdf, ppt, pptx)
 * @returns {Promise<Object>} Extracted content and metadata
 */
async function processUploadedFile(filePath, fileType) {
  try {
    console.log(`🔍 Starting file processing...`);
    console.log(`   File path: ${filePath}`);
    console.log(`   File type: ${fileType}`);
    
    // Verify file exists first
    try {
      const stats = await fs.stat(filePath);
      console.log(`✅ File found: ${stats.size} bytes`);
    } catch (err) {
      console.error(`❌ File not found: ${filePath}`);
      throw new Error('File not found or inaccessible');
    }
    
    let slides = [];
    const ext = path.extname(filePath).toLowerCase();
    
    console.log(`📄 File extension detected: ${ext}`);

    // Extract content based on file type
    if (ext === '.pdf') {
      console.log('🔄 Processing as PDF...');
      slides = await extractPDFContent(filePath);
    } else if (ext === '.ppt' || ext === '.pptx') {
      console.log('🔄 Processing as PowerPoint...');
      slides = await extractPPTContent(filePath);
    } else {
      throw new Error(`Unsupported file type: ${ext}. Only .pdf, .ppt, and .pptx are supported.`);
    }

    console.log(`✅ Extraction complete: ${slides.length} slides found`);

    // Get file stats
    const stats = await fs.stat(filePath);

    return {
      success: true,
      slides: slides,
      slideCount: slides.length,
      fileSize: stats.size,
      extractedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ File processing error:', error);
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);
    console.error('   Error stack:', error.stack);
    
    // Return a valid structure even on error
    return {
      success: false,
      error: error.message || 'Unknown error during file processing',
      slides: ['Error extracting content. Please add slides manually.'],
      slideCount: 1
    };
  }
}

/**
 * Clean up uploaded file
 * @param {string} filePath - Path to file to delete
 */
async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`✅ Deleted file: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error deleting file ${filePath}:`, error.message);
  }
}

/**
 * Validate slide content
 * @param {Array} slides - Array of slide content
 * @returns {boolean} Whether slides are valid
 */
function validateSlides(slides) {
  if (!Array.isArray(slides)) {
    return false;
  }

  if (slides.length === 0) {
    return false;
  }

  // Check if at least one slide has meaningful content
  const hasContent = slides.some(slide => 
    typeof slide === 'string' && slide.trim().length > 0
  );

  return hasContent;
}

module.exports = {
  extractPDFContent,
  extractPPTContent,
  processUploadedFile,
  deleteFile,
  validateSlides
};