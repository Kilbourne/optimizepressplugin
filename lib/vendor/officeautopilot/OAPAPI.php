<?php

/**
 * Office Auto Pilot PHP API Wrapper Class (OAP-PHP-API)
 *
 * Simplifies access to the Office Auto Pilot API
 *
 * @package     OAP-PHP-API
 * @author      Neal Lambert
 * @updated     by Neal Lambert 05/06/2013
 * @website     http://officeautopilot.com/
 * @api         https://officeautopilot.zendesk.com/forums/20723902-API
 */

class OP_OAPAPI {

    //API CREDENTIALS
    var $AppID      = '';
    var $Key        = '';

    //API URL
    var $host       = 'http://api.moon-ray.com/';

    //SERVICES
    var $contact    = 'cdata.php';
    var $product    = 'pdata.php';
    var $form       = 'fdata.php';

    /**
     * @var OptimizePress_Modules_Email_LoggerInterface
     */
    protected $logger;

    /**
    * Init
    *
    * Set the initial API setttings
    *
    * @param: $params (array) - must contain the key 'AppID' and 'Key'
    */

    function __construct($params)
    {
        if(empty($params['AppID']) OR empty($params['Key']))
            throw new Exception("Missing OAP API Appid or Key");

        if (isset($params['Host'])) {
            $this->host = $params['Host'];
        }

        $this->AppID    = $params['AppID'];
        $this->Key      = $params['Key'];
    }

    public function set_logger(OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
    * Add Contact (contact)
    *
    * Add a new contact to the database. Note: This function only supports
    * adding a single contact at a time.
    *
    * @access  public
    * @param  $contact (array) array containing the fields, tags, and sequences to add to a new contact record
    * @return  (SimpleXMLObject) an array of updated contact records
    */

    public function add_contact($contact=FALSE)
    {
        $data = '<contact>';
        $tags = '';

        //FIELDS
        $data .= '<Group_Tag name="Contact Information">';
        foreach($contact['fields'] as $field_name => $field_data)
        {
            if ($field_name != 'tags') {
                $data .= '<field name="'.$field_name.'">'.$field_data.'</field>';
            } else {
                $tags = '*/*' . implode('*/*', $field_data) . '*/*';
            }
        }
        $data .= '</Group_Tag>';

        //TAGS / SEQUENCES
        $data .= '<Group_Tag name="Sequences and Tags">';

            $data .= '<field name="Contact Tags">'. $tags . '</field>';
            $data .= '<field name="Sequences">'.(!empty($contact['sequences']) ? '*/*'.implode('*/*',$contact['sequences']).'*/*' : '').'</field>';

        $data .= '</Group_Tag>';

        $data .= '</contact>';

        if ($service = $this->_service('contact'))
        {
            // add GDPR note

            return $this->_request($service, 'add', $data);
        }

        return FALSE;
    }

    /**
    * Update Contact(s) (contact)
    *
    * @access  public
    * @param  $contact (array) array of multiple contacts to be updated
    * @return  (SimpleXMLObject) array of updated contacts
    */

    public function update_contacts($contacts=FALSE)
    {
        $data = '';

        foreach($contacts as $contact)
        {
            $data .= '<contact id="'.$contact['id'].'">';

            //FIELDS
            $data .= '<Group_Tag name="Contact Information">';
            foreach($contact['fields'] as $field_name => $field_data)
            {
                $data .= '<field name="'.$field_name.'">'.$field_data.'</field>';
            }
            $data .= '</Group_Tag>';

            $data .= '</contact>';
        }

        if($service = $this->_service('contact'))
        {
            return $this->_request($service,'update',$data);
        }


        return FALSE;
    }

    /**
    * Delete Contact(s) (contact)
    *
    * @access  public
    * @param  $contact_ids (array) an array of OAP contact ids to be deleted
    * @return FALSE on error or a string with a sucesss message
    */

    public function delete_contacts($contact_ids=FALSE)
    {
        $data = '';

        foreach($contact_ids as $contact_id)
        {
            $data .= '<contact_id>'.$contact_id.'</contact_id>';
        }

        if($service = $this->_service('contact'))
        {
            return $this->_request($service,'delete',$data);
        }


        return FALSE;
    }


    /**
    * Add Tags (contact)
    *
    * @access  public
    * @param  $contacts (array) an array containing a contact id(s)
    * @param  $tags (array) an array containing a list of tags(s)
    * @param  $remove (boolean)  When set to TRUE instead removes the tag(s). Mainly for internal use only.
    * @return (SimpleXMLObject) "result" containing each tag and the success/failure status
    */

    public function add_tags($contacts=array(),$tags=array(),$remove=FALSE)
    {
        $data = '';

        //PREPARE XML TO SEND
        foreach($contacts as $contact_id)
        {
            $data .= "<contact id='".$contact_id."'>
            ";

            foreach($tags as $tag)
                $data .= '<tag>'.$tag."</tag>";

            $data .= "</contact>";
        }

        //SAVE RESULT
        return $this->_request($this->contact,(!$remove ? 'add_tag' : 'remove_tag'),$data);
    }

    /**
    * Remove Tags (contact)
    *
    * @access public
    * @param $contacts (array)  = an array containing a contact id(s)
    * @param $tags (array)      = an array containing a list of tags(s)
    * @return (SimpleXMLObject) "result" containing each tag and the success/failure status
    */

    public function remove_tags($contacts=array(),$tags=array())
    {
        return $this->add_tags($contacts,$tags,TRUE);
    }

    /**
    * Start Sequences (contact)
    *
    * @access public
    * @param $contacts (array) an array of contact ids to update
    * @param $sequences (array) an array of sequnces ids to be added to the contact record
    * @param $remove (boolean) when set to TRUE will instead remove the sequences. Mainly used internally.
    * @return (SimpleXMLObject) "result" containing each updated contact record
    */

    public function start_sequences($contacts=array(),$sequences=array(),$remove=FALSE)
    {
        $data = '';

        //PREPARE XML TO SEND
        foreach($contacts as $contact_id)
        {
            $data .= "<contact id='".$contact_id."'>";
            $data .= "<Group_Tag name='Sequences and Tags'><field name='Tags'></field>";
            $data .= "<field name='Sequences'".($remove ? " action='remove'" : '').'>*/*'.implode('*/*',$sequences)."*/*</field>";
            $data .= "</Group_Tag>";
            $data .= "</contact>";
        }

        //SAVE RESULT
        return $this->_request($this->contact,'update',$data);
    }

    /**
    * Stop Sequences (contact)
    *
    * @access public
    * @param $contacts (array) an array of contact ids to update
    * @param $sequences (array) an array of sequnces ids to be removed from the contact record
    * @return (SimpleXMLObject) "result" containing each updated contact record
    */

    public function stop_sequences($contacts=array(),$sequences=array())
    {
        return $this->start_sequences($contacts,$sequences,TRUE);
    }

    /**
     * Add notes to contact
     *
     * @param $contactId
     * @param $note
     * @return bool|SimpleXMLElement
     */
    public function add_note($contactId, $note)
    {
        $data = '';
        $data .= '<contact id="' . $contactId . '">';
        $data .= '<note time="' . time() . '">' . $note . '</note>';
        $data .= '</contact>';

        return $this->_request($this->contact, 'add_notes', $data);
    }

    /**
    * Search (contact,product,form)
    *
    * @access public
    * @param $type (string) which api to search. valid strings are: contact,product,form.
    * @param $patterns (array) (field => '', op => '', value => '') contains a field to be search, and operator for compare, and a value to compare
    * @see https://officeautopilot.zendesk.com/entries/22308086-Contacts-API#search for a list of operators and for additional details
    * @return:  array of contacts, or products
    */

    public function search($type=FALSE,$patterns=FALSE)
    {

        $data = '<search>';

        foreach($patterns as $pattern)
        {
            $data .= '<equation>';
                $data .= '<field>'.$pattern['field'].'</field>';
                $data .= '<op>'.$pattern['op'].'</op>';
                $data .= '<value>'.$pattern['value'].'</value>';
            $data .= '</equation>';
        }

        $data .= '</search>';



        if($service = $this->_service($type))
        {
            return $this->_request($service,'search',$data);
        }

        return FALSE;
    }

    /**
    * Fetch (contact,product,form)
    *
    * Allows you to fetch contacts, products, and forms from OAP.
    *
    * @access public
    * @param $type (string) - contact,product,form;
    * @param $data (array)(contact,product) or (string) for (form)
    * @return  array of contacts, or products
    */

    public function fetch($type=FALSE,$data=FALSE)
    {
        if($service = $this->_service($type))
        {
            $xml = '';

            switch($service)
            {
                //CONTACTS
                case 'cdata.php':
                    foreach ($data as $contact_id)
                    $xml .= '<contact_id>'.$contact_id.'</contact_id>';
                    break;
                //PRODUCTS
                case 'pdata.php':
                    foreach ($data as $product_id)
                    $xml .= '<product_id>'.$product_id.'</product_id>';
                    break;
                //FORMS
                case 'fdata.php':
                    $xml .= 'id='.$data;
                    break;
            }

            return $this->_request($service,'fetch', $xml, true);
        }

        return FALSE;
    }

    /**
    * Fetch Tags Type (contact)
    *
    * Returns a list of all tag names in the account. Recommended to use "Pull Tag" instead of this function.
    *
    * @access public
    * @return (SimpleXMLObject) array of tags
    */

    public function fetch_tags_type()
    {
        $return = $this->_request($this->contact,'fetch_tag',FALSE);

        if(!empty($return->tags))
        {
            $tags = explode('*/*',$return->tags);

            return (is_array($tags) ? array_filter($tags) : $tags);
        }

        return FALSE;
    }

    /**
    * Fetch Sequences Type (contact)
    *
    * @access public
    * @return (SimpleXMLObject)  array of sequences e.g. [24] =>  'sequence name which has id 24'
    */

    public function fetch_sequences_type()
    {
        $sequences = FALSE;

        //MAKE API REQUEST
        $return = $this->_request($this->contact,'fetch_sequences',FALSE);

        //CONVERT TO ARRAY
        if(!empty($return->sequence))
        {
            foreach($return->sequence as $sequence)
                $sequences[(string)$sequence->attributes()->id] = (string)$sequence;
        }

        return $sequences;
    }

    /**
    * Key Type (contact, product)
    *
    * The Key Type is used to visually map out all the fields that are used for a contact on your system. The
    * fields are organized in groups.
    *
    * @access public
    * @return (SimpleXMLObject) array of tags
    */

    public function key_type($type=FALSE)
    {
        if($service = $this->_service($type))
        {
            return $this->_request($service,'key','');
        }

        return FALSE;
    }

    /**
    * Pull Tag (contact)
    *
    * List of tag names in the account with corresponding ids
    *
    * @access public
    * @return (SimpleXMLObject) array of tags
    */

    public function pull_tag()
    {
        $return = $this->_request($this->contact,'pull_tag',FALSE);

        $tags = array();

        if(!empty($return->tag))
            foreach($return->tag as $tag)
                $tags[(int)$tag->attributes()->id] = (string)$tag;

        return $tags;
    }

    /**
    * Verify Service
    *
    * Checks to see if the API service name is valid and returns the corresponding service URL
    *
    * @access private
    * @param $key (string) the service name to be checked
    * @return (string)
    */

    private function _service($key)
    {
        switch ($key)
        {
            case 'contact':
                return $this->contact;
                break;
            case 'contacts':
                return $this->contact;
                break;
            case 'product':
                return $this->product;
                break;
            case 'products':
                return $this->product;
                break;
            case 'form':
                return $this->form;
                break;
            case 'forms':
                return $this->form;
                break;
            default:
                return FALSE;
                break;
        }
    }

    /**
    * Request
    *
    * Make a request to the Office Auto Pilot XML Rest API
    *
    * @access private
    * @param $service (string) main API service URL
    * @param $reqType (string) which function to use
    * @param $data_xml (xml) the xml to send
    * @param $return_id (boolean) 1 returns full record(s) in addtion to the success/fail message.
    *                             2 returns the contact id an date last modified in addtion to the success/fail message.
    * @param $f_add (boolean) when set, forces a new contact to be added (regardless if a contact with a matching email address is found).
    *                         Note: "Add" requests initialize this to true, "update" requests initialize it to false.
    * @return:  object
    */

    private function _request($service,$reqType,$data=FALSE,$return_id=FALSE,$f_add=FALSE)
    {
        $postargs = "Appid=".$this->AppID."&Key=".$this->Key."&reqType=".$reqType.($return_id ? '&return_id=2' : '&return_id=1').($data ? '&data='.rawurlencode($data) : '').($f_add ? '&f_add=1' : '');

        //print_r($postargs);

        $ch = curl_init($this->host.'/'.$service);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postargs);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        $output = curl_exec($ch);
        curl_close($ch);

        $this->logger->debug('Response: ' . print_r($output, true) . "\n");

        //DEBUG
        //print_r($output);
        //exit();

        return (!empty($output) ? new SimpleXMLElement($output) : FALSE );
    }

}

/* End of file oap-php-api.php */
/* Location: ./oap-php-api.php */