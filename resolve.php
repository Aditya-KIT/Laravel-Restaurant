<?php
$directory = new RecursiveDirectoryIterator(__DIR__);
$iterator = new RecursiveIteratorIterator($directory);

$count = 0;
foreach ($iterator as $info) {
    if ($info->isFile()) {
        $path = $info->getPathname();
        if (strpos($path, DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR) !== false || 
            strpos($path, DIRECTORY_SEPARATOR . 'node_modules' . DIRECTORY_SEPARATOR) !== false || 
            strpos($path, DIRECTORY_SEPARATOR . '.git' . DIRECTORY_SEPARATOR) !== false) {
            continue;
        }

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
echo "Total resolved: $count\n";
