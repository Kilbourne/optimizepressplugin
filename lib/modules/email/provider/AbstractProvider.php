<?php

/**
 * ConvertKit email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
abstract class OptimizePress_Modules_Email_Provider_AbstractProvider
{
    /**
     * Return filtered tags (remove empty ones via array_filter callback).
     * @param  array $tags
     * @return array
     */
    protected function cleanEmptyTags($tags)
    {
        return array_filter($tags, array($this, 'discardNullTag'));
    }

    /**
     * Discard tag (return false) if tag is either empty string or if it is "-".
     * @param  string $tag
     * @return boolean
     */
    protected function discardNullTag($tag)
    {
        $tag = trim($tag);

        return ! empty($tag) && '-' !== $tag;
    }

    /**
     * Return condensed GDPR note.
     *
     * @return string
     */
    protected function getGdprNote()
    {
        $consentNotes = '';

        if (isset($_POST['op_gdpr_button_label']) && ! empty($_POST['op_gdpr_button_label'])) {
            $consentNotes .= 'Button Text: ' . sanitize_text_field($_POST['op_gdpr_button_label']);
        }
        if (isset($_POST['op_gdpr_consent_label']) && is_array($_POST['op_gdpr_consent_label'])) {
            foreach ($_POST['op_gdpr_consent_label'] as $key => $value) {
                $consentNotes .= " | Consent $key Text: $value";
            }
        }

        return $consentNotes;
    }
}