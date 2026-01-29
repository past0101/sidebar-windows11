const { nativeImage } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function extractIconWithPowerShell(filePath) {
  return new Promise((resolve) => {
    const tempIconPath = path.join(os.tmpdir(), `icon_${Date.now()}.png`);
    
    const psScript = `
Add-Type -AssemblyName System.Drawing
$filePath = "${filePath.replace(/\\/g, '\\\\')}"
$outputPath = "${tempIconPath.replace(/\\/g, '\\\\')}"
try {
    $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($filePath)
    if ($icon) {
        $size = 48
        $bitmap = New-Object System.Drawing.Bitmap($size, $size)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
        $graphics.DrawIcon($icon, $rect)
        $graphics.Dispose()
        $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bitmap.Dispose()
        $icon.Dispose()
        Write-Host "SUCCESS"
    } else {
        Write-Host "NO_ICON"
    }
} catch {
    Write-Host "ERROR: $_"
}
`;

    const scriptPath = path.join(os.tmpdir(), `extract_${Date.now()}.ps1`);
    
    try {
      fs.writeFileSync(scriptPath, psScript, 'utf8');
      
      exec(
        `powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`,
        { timeout: 8000, windowsHide: true },
        (error, stdout, stderr) => {
          try { fs.unlinkSync(scriptPath); } catch (e) {}
          
          if (fs.existsSync(tempIconPath)) {
            try {
              const stats = fs.statSync(tempIconPath);
              if (stats.size > 0) {
                const iconData = fs.readFileSync(tempIconPath);
                const icon = nativeImage.createFromBuffer(iconData);
                fs.unlinkSync(tempIconPath);
                
                if (!icon.isEmpty()) {
                  console.log('PowerShell icon extraction successful');
                  resolve(icon.toDataURL());
                  return;
                }
              }
              fs.unlinkSync(tempIconPath);
            } catch (err) {
              console.error('Error reading extracted icon:', err);
              try { fs.unlinkSync(tempIconPath); } catch (e) {}
            }
          }
          
          if (stdout && stdout.includes('ERROR')) {
            console.error('PowerShell error:', stdout);
          }
          
          resolve(null);
        }
      );
    } catch (err) {
      console.error('Error creating PowerShell script:', err);
      resolve(null);
    }
  });
}

module.exports = { extractIconWithPowerShell };
