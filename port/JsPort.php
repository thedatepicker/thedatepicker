<?php declare(strict_types = 1);

namespace Port;

use Exception;
use function preg_last_error;
use function preg_last_error_msg;
use function preg_quote;
use function preg_replace;
use function sprintf;

class PortException extends Exception
{
}

class JsPort
{

	private const PCRE_DELIMITER = '#';
	private const PCRE_MULTILINE = 'm';

	public function __construct(
		private string $namespace,
	)
	{
		$this->namespace = preg_quote($namespace, self::PCRE_DELIMITER);
	}

	public function portModuleToNamespace(string $source): string
	{
		$source = $this->removeImports($source);
		$source = $this->removeDefaultExport($source);
		$source = $this->addNamespace($source);

		return $source;
	}

	private function removeImports(string $source): string
	{
		return $this->replace(
			$source,
			self::PCRE_DELIMITER . '^import\\s+.+;\\n+' . self::PCRE_DELIMITER . self::PCRE_MULTILINE,
			'',
			__FUNCTION__,
		);
	}

	private function removeDefaultExport(string $source): string
	{
		return $this->replace(
			$source,
			self::PCRE_DELIMITER . '^export\\s+default\b' . self::PCRE_DELIMITER . self::PCRE_MULTILINE,
			'export',
			__FUNCTION__,
			isRequired: true,
		);
	}

	private function addNamespace(string $source): string
	{
		$source = $this->replace(
			$source,
			self::PCRE_DELIMITER . '^(?!\\n)' . self::PCRE_DELIMITER . self::PCRE_MULTILINE,
			"\t",
			__FUNCTION__,
			isRequired: true,
		);

		return sprintf(
			"namespace %s {\n\n%s\n}\n",
			$this->namespace,
			$source,
		);
	}

	private function replace(
		string $source,
		string $pattern,
		string $replacement,
		string $methodName,
		bool $isRequired = false,
	): string
	{
		$error = sprintf('Porting error > %s > ', $methodName);

		$modifiedSource = preg_replace($pattern, $replacement, $source);
		if ($modifiedSource === null) {
			$error .= 'PCRE error';
			$errorNo = preg_last_error();
			if ($errorNo !== 0) {
				throw new PortException($error . sprintf(' > %s (%d)', preg_last_error_msg(), $errorNo));
			}
			throw new PortException($error);
		}

		if ($isRequired && $modifiedSource === $source) {
			throw new PortException($error .  'replacement did not pass.');
		}

		return $modifiedSource;
	}

}
