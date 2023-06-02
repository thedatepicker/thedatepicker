<?php declare(strict_types = 1);

include __DIR__ . '/port/FileIterator.php';
include __DIR__ . '/port/JsPort.php';

use Port\File;
use Port\FileIterator;
use Port\JsPort;

$srcDir = __DIR__ . '/src';
$namespacedDir = __DIR__ . '/namespaced';

/** @var IteratorAggregate<int, File> $fileIterator */
$fileIterator = new FileIterator($srcDir, 'ts');
$jsPort = new JsPort('TheDatepicker');

$errorsCount = 0;
foreach ($fileIterator as $file) {
	if ($file->getFileName() === 'index.ts') {
		continue;
	}

	echo sprintf('Porting %s ... ', $file->getFileName());

	try {
		file_put_contents(
			sprintf('%s/%s', $namespacedDir, $file->getFileName()),
			$jsPort->portModuleToNamespace($file->getSource()),
		);
		echo 'OK';

	} catch (Throwable $e) {
		$errorsCount++;
		echo sprintf('Error: %s', $e->getMessage());
	}

	echo "\n";
}

echo $errorsCount > 0 ? 'Port failed' : 'Port successful';
echo "\n";
