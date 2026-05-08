<?php
$excludeDirs = ['vendor', 'node_modules', '.git'];

function processDir($dir, $excludeDirs) {
    $count = 0;
    $items = scandir($dir);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }

        $path = $dir . DIRECTORY_SEPARATOR . $item;
        
        if (is_dir($path)) {
            if (!in_array($item, $excludeDirs)) {
                $count += processDir($path, $excludeDirs);
            }
        } elseif (is_file($path)) {
            $content = file_get_contents($path);
            if (strpos($content, '<<<<<<< HEAD') !== false) {
                $newContent = preg_replace('/<<<<<<< HEAD\r?\n(.*?)=======\r?\n.*?\r?\n>>>>>>> .*?(?:\r?\n|$)/s', '$1', $content);
                if ($newContent !== null && $newContent !== $content) {
                    file_put_contents($path, $newContent);
                    echo "Resolved $path\n";
                    $count++;
                }
            }
        }
    }
    return $count;
}

$count = processDir(__DIR__, $excludeDirs);
echo "Total resolved: $count\n";
