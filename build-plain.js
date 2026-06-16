const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const { execSync } = require('child_process');

const namespacedDir = path.join(__dirname, 'namespaced');
const distDir = path.join(__dirname, 'dist');
const tempFile = path.join(__dirname, 'temp-bundle.ts');
const outputFile = path.join(distDir, 'the-datepicker.js');
const declConfigFile = path.join(__dirname, 'tsconfig.decl.json');
const tempDeclName = path.join(distDir, 'temp-bundle.d.ts');
const finalDeclName = path.join(distDir, 'the-datepicker.d.ts');

// Order matters - dependencies first
const files = [
    'Helper.ts',
    'DateConverter.ts', 
    'Translator.ts',
    'Options.ts',
    'Day.ts',
    'ClassNames.ts',
    'HtmlHelper.ts',
    'ViewModel.ts',
    'Template.ts',
    'Datepicker.ts'
];

// Cleanup from previous run
if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
if (fs.existsSync(tempDeclName)) fs.unlinkSync(tempDeclName);

// Concat all files
let content = '';
for (const file of files) {
    const filePath = path.join(namespacedDir, file);
    content += fs.readFileSync(filePath, 'utf8') + '\n';
}

fs.writeFileSync(tempFile, content);

// Build JS with esbuild
esbuild.buildSync({
    entryPoints: [tempFile],
    outfile: outputFile,
    bundle: false,
    format: 'iife',
    globalName: 'TheDatepicker',
    target: 'es2016',
    minify: false,
});

// Generate declarations with tsc using dedicated config
try {
    // Update tsconfig.decl.json with the temp file
    const declConfig = {
        compilerOptions: {
            target: 'ES2016',
            noImplicitAny: true,
            removeComments: true,
            preserveConstEnums: true,
            declaration: true,
            emitDeclarationOnly: true,
            skipLibCheck: true,
            strict: false,
            outDir: 'dist'
        },
        files: [tempFile]
    };
    fs.writeFileSync(declConfigFile, JSON.stringify(declConfig, null, '\t'));
    
    execSync(`npx tsc --project "${declConfigFile}"`, {
        stdio: 'inherit'
    });
    
    // Rename declaration file
    if (fs.existsSync(tempDeclName)) {
        if (fs.existsSync(finalDeclName)) {
            fs.unlinkSync(finalDeclName);
        }
        fs.renameSync(tempDeclName, finalDeclName);
    }
} catch (e) {
    console.warn('Warning: Could not generate declarations:', e.message);
} finally {
    // Reset tsconfig.decl.json
    const declConfigClean = {
        compilerOptions: {
            target: 'ES2016',
            noImplicitAny: true,
            removeComments: true,
            preserveConstEnums: true,
            declaration: true,
            emitDeclarationOnly: true,
            skipLibCheck: true,
            strict: false,
            outDir: 'dist'
        },
        files: []
    };
    fs.writeFileSync(declConfigFile, JSON.stringify(declConfigClean, null, '\t'));
}

// Cleanup
if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

console.log('Build successful!');

