---
title: Android EditText automatic MAC address formatting
date: "2014-01-16T00:00:00.000Z"
description: How to apply automatic MAC address formatting to EditText and prevent invalid input?
featuredImage: /assets/featured/android.jpg
commentsUrl: https://github.com/tihomir-kit/tkit.dev/issues/41
tags: ["android", "automatic", "edittext", "formatting", "java", "mac"]
---

I recently made a [simple Android Wake-on-Lan app](/2014/01/16/automatic-wake-on-lan-android/) which includes an `EditText` MAC address input field. To make it easier for users to type in proper MAC's (not having to type colons manually) I used `TextWatcher` to automatically format the input on text-changed event. This [StackOverflow topic](http://stackoverflow.com/questions/5947674/custom-format-edit-text-input-android) gave me a general idea on how to do it. What I wanted is for the application to insert a colon after every second character, remove the character preceding a colon if the user deletes the colon and to handle MAC address editing. For example if the user takes out a few characters from the middle of the string, the formatting should still be preserved and the cursor should stay in the right place and not go to the end or beginning of the string.

The only callback I used was `onTextChanged()`. On each text-change event, users input gets stripped of all non-MAC characters (this means only numbers 0-9 and letters A-F are left), then the colons are added and after that (potential) character deletion and cursor positioning are handled. Here is the code I came up with in the end:

```java
private EditText mMacEdit = (EditText)findViewById(R.id.edit_mac);

/**
 * Registers TextWatcher for MAC EditText field. Automatically adds colons,
 * switches the MAC to upper case and handles the cursor position.
 */
private void registerAfterMacTextChangedCallback() {
    mMacEdit.addTextChangedListener(new TextWatcher() {
        String mPreviousMac = null;

        /* (non-Javadoc)
         * Does nothing.
         * @see android.text.TextWatcher#afterTextChanged(android.text.Editable)
         */
        @Override
        public void afterTextChanged(Editable arg0) {
        }

        /* (non-Javadoc)
         * Does nothing.
         * @see android.text.TextWatcher#beforeTextChanged(java.lang.CharSequence, int, int, int)
         */
        @Override
        public void beforeTextChanged(CharSequence arg0, int arg1, int arg2, int arg3) {
        }

        /* (non-Javadoc)
         * Formats the MAC address and handles the cursor position.
         * @see android.text.TextWatcher#onTextChanged(java.lang.CharSequence, int, int, int)
         */
        @SuppressLint("DefaultLocale")
        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            String enteredMac = mMacEdit.getText().toString().toUpperCase();
            String cleanMac = clearNonMacCharacters(enteredMac);
            String formattedMac = formatMacAddress(cleanMac);

            int selectionStart = mMacEdit.getSelectionStart();
            formattedMac = handleColonDeletion(enteredMac, formattedMac, selectionStart);
            int lengthDiff = formattedMac.length() - enteredMac.length();

            setMacEdit(cleanMac, formattedMac, selectionStart, lengthDiff);
        }

        /**
         * Strips all characters from a string except A-F and 0-9.
         * @param mac       User input string.
         * @return          String containing MAC-allowed characters.
         */
        private String clearNonMacCharacters(String mac) {
            return mac.toString().replaceAll("[^A-Fa-f0-9]", "");
        }

        /**
         * Adds a colon character to an unformatted MAC address after
         * every second character (strips full MAC trailing colon)
         * @param cleanMac      Unformatted MAC address.
         * @return              Properly formatted MAC address.
         */
        private String formatMacAddress(String cleanMac) {
            int grouppedCharacters = 0;
            String formattedMac = "";

            for (int i = 0; i < cleanMac.length(); ++i) {
                formattedMac += cleanMac.charAt(i);
                ++grouppedCharacters;

                if (grouppedCharacters == 2) {
                    formattedMac += ":";
                    grouppedCharacters = 0;
                }
            }

            // Removes trailing colon for complete MAC address
            if (cleanMac.length() == 12)
                formattedMac = formattedMac.substring(0, formattedMac.length() - 1);

            return formattedMac;
        }

        /**
         * Upon users colon deletion, deletes MAC character preceding deleted colon as well.
         * @param enteredMac            User input MAC.
         * @param formattedMac          Formatted MAC address.
         * @param selectionStart        MAC EditText field cursor position.
         * @return                      Formatted MAC address.
         */
        private String handleColonDeletion(String enteredMac, String formattedMac, int selectionStart) {
            if (mPreviousMac != null && mPreviousMac.length() > 1) {
                int previousColonCount = colonCount(mPreviousMac);
                int currentColonCount = colonCount(enteredMac);

                if (currentColonCount < previousColonCount) {
                    formattedMac = formattedMac.substring(0, selectionStart - 1) + formattedMac.substring(selectionStart);
                    String cleanMac = clearNonMacCharacters(formattedMac);
                    formattedMac = formatMacAddress(cleanMac);
                }
            }
            return formattedMac;
        }

        /**
         * Gets MAC address current colon count.
         * @param formattedMac      Formatted MAC address.
         * @return                  Current number of colons in MAC address.
         */
        private int colonCount(String formattedMac) {
            return formattedMac.replaceAll("[^:]", "").length();
        }

        /**
         * Removes TextChange listener, sets MAC EditText field value,
         * sets new cursor position and re-initiates the listener.
         * @param cleanMac          Clean MAC address.
         * @param formattedMac      Formatted MAC address.
         * @param selectionStart    MAC EditText field cursor position.
         * @param lengthDiff        Formatted/Entered MAC number of characters difference.
         */
        private void setMacEdit(String cleanMac, String formattedMac, int selectionStart, int lengthDiff) {
            mMacEdit.removeTextChangedListener(this);
            if (cleanMac.length() <= 12) {
                mMacEdit.setText(formattedMac);
                mMacEdit.setSelection(selectionStart + lengthDiff);
                mPreviousMac = formattedMac;
            } else {
                mMacEdit.setText(mPreviousMac);
                mMacEdit.setSelection(mPreviousMac.length());
            }
            mMacEdit.addTextChangedListener(this);
        }
    });
}
```

One important thing to note is the removal and re-adding of `TextChangedListener` in the `setMacEdit()` method. Without this part the code results in a stack overflow since every `setText()` triggers the `TextChangedListener` over and over again.

Hope it helps, enjoy! :)