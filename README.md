Simple Login Widget
===

A bare bones javascript login widget for Salesforce External Identity and Communities

To get started:

1. Create your Community and configure it for login as expected
2. Create a public static resource called 'salesforce_simple_login_widget' from the javascript in the StaticResources directory
3. Add the _callback.html file to your site and capture the URL
4. Create a Connected App.  Select a scope of id, and set your callback url to the fully qualified URL from step 3
5. Add the widget to your page as seen in the example index.html file, configuring each of the meta properties

