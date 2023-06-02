<?php declare(strict_types = 1);

namespace Port;

use ArrayIterator;
use DirectoryIterator;
use Exception;
use IteratorAggregate;
use SplFileInfo;

class FileIteratorException extends Exception
{
}

class File
{

	public function __construct(
		private readonly SplFileInfo $fileInfo,
	)
	{
	}

	public function getPath(): string
	{
		$path = $this->fileInfo->getRealPath();
		if ($path === false) {
			throw new FileIteratorException('File does not exist.');
		}

		return $path;
	}

	public function getFileName(): string
	{
		return $this->fileInfo->getFilename();
	}

	public function getSource(): string
	{
		$soruce = file_get_contents($this->getPath());
		if ($soruce === false) {
			throw new FileIteratorException('File read failed.');
		}

		return $soruce;
	}

}

class FileIterator implements IteratorAggregate
{

	/** @var File[] */
	private array $files;

	public function __construct(
		string $dir,
		string $fileExtension,
	)
	{
		$directoryIterator = new DirectoryIterator($dir);
		foreach ($directoryIterator as $fileInfo) {
			if ($fileInfo->isFile() && $fileInfo->getExtension() === $fileExtension) {
				$this->files[] = new File($fileInfo->getFileInfo());
			}
		}
	}

	/**
	 * @return ArrayIterator<int, File>
	 */
	public function getIterator(): ArrayIterator
	{
		return new ArrayIterator($this->files);
	}

}
