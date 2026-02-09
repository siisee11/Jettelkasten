import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function copyFiles(srcDir, destDir) {
    // Clear the destination directory
    if (fs.existsSync(destDir)) {
        fs.rmSync(destDir, { recursive: true });
    }

    // Create the destination directory
    fs.mkdirSync(destDir, { recursive: true });

    // Read the source directory
    fs.readdir(srcDir, (err, files) => {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }

        files.forEach((file, index) => {
            const srcFile = path.join(srcDir, file);
            const destFile = path.join(destDir, file);

            // Skip Secrets folder entirely
            if (file === 'Secrets') {
                return;
            }

            // Check if it's a file or a directory
            fs.stat(srcFile, (err, stat) => {
                if (err) {
                    console.error("Error stating file.", err);
                    return;
                }

                if (stat.isFile() && path.extname(srcFile) === '.md') {
                    // It's a markdown file, parse it
                    const content = fs.readFileSync(srcFile, 'utf8');
                    const metadata = matter(content).data;

                    const tags = Array.isArray(metadata.tags) ? metadata.tags : [];

                    // If it has the 'private' tag, replace content before copying
                    if (tags.includes('private')) {
                        const sanitized = matter.stringify('This document is private.', metadata);
                        fs.writeFileSync(destFile, sanitized, 'utf8');
                        return;
                    }

                    // If it has the 'public' tag, copy it
                    if (tags.includes('public')) {
                        fs.copyFile(srcFile, destFile, (err) => {
                            if (err) {
                                console.error(`Error copying file ${srcFile}.`, err);
                            }
                        });
                    }
                } else if (stat.isDirectory()) {
                    // It's a directory, create it and recurse
                    fs.mkdir(destFile, { recursive: true }, (err) => {
                        if (err) {
                            console.error(`Error creating directory ${destFile}.`, err);
                            return;
                        }

                        // Recurse into the directory
                        copyFiles(srcFile, destFile);
                    });
                }
            });
        });
    });
}

// Get the source and destination directories from the command line arguments
const srcDir = process.argv[2];
const destDir = './content';

if (!srcDir || !destDir) {
    console.error('Please provide a source and destination directory.');
    process.exit(1);
}

// Run the function
copyFiles(srcDir, destDir);
