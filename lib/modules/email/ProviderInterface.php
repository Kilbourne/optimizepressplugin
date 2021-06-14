<?php

/**
 * Interface for email marketing service providers
 * @author OptimizePress <info@optimizepress.com>
 */
interface OptimizePress_Modules_Email_ProviderInterface
{
	/**
	 * Return collection of lists
	 * @return array
	 */
	public function getLists();

	/**
	 * Return formated data
	 * @return  array
	 */
	public function getData();

	/**
	 * Checks if provider integration is enabled (if API data is entered)
	 * @return boolean
	 */
	public function isEnabled();

	/**
	 * Subscribes user to mailing list
	 * @param  arrat $data
	 * @return boolean
	 */
	public function subscribe($data);

	/**
	 * Returns provider client
	 * @return stdClass
	 */
	public function getClient();

	/**
	 * Registers user on provider (used when registering/ordering)
	 * @param  string $list
	 * @param  string $email
	 * @param  string $fname
	 * @param  string $lname
	 * @return bool
	 */
	public function register($list, $email, $fname, $lname);

	/**
	 * Returns formated list collection
	 * @return array
	 */
	public function getItems();

	/**
	 * Returns custom fields for list
	 * @param  string $listId
	 * @return array
	 */
	public function getListFields($listId);
}