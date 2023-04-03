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
