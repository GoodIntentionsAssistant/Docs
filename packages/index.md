---
layout: page_packages
title: Packages
---

Packages are a collection of skills (intents, entities and data) that you can install on your own GI assistant.

## How to Install

From your root directory use the gi node script.

This will call the package manager and use NPM to download the package to the `node_modules` directory then create a symbolic link to your `app` directory.

~~~
node gi install gi-skill-basics
~~~


## Prebuilt Skills

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Package Identifier</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>

    <tr>
      <td><a href="https://www.npmjs.com/package/gi-skill-flipcoin" target="_blank">Flip Coin</a></td>
      <td>gi-skill-flipcoin</td>
      <td>Flip a coin, heads or tails. It can also flip multiple coins.</td>
    </tr>
  
    <tr>
      <td><a href="https://www.npmjs.com/package/gi-skill-guessnumber" target="_blank">Guess Number</a></td>
      <td>gi-skill-guessnumber</td>
      <td>The assistant can give you a random number</td>
    </tr>
  
    <tr>
      <td><a href="https://www.npmjs.com/package/gi-skill-helloworld" target="_blank">Hello World</a></td>
      <td>gi-skill-helloworld</td>
      <td>Hello world intent</td>
    </tr>
  
    <tr>
      <td><a href="https://www.npmjs.com/package/gi-skill-basics" target="_blank">Basics</a></td>
      <td>gi-skill-basics</td>
      <td>Core skill for errors and basic assistant commands</td>
    </tr>
  
    <tr>
      <td><a href="https://www.npmjs.com/package/gi-skill-catfacts" target="_blank">Cat Facts</a></td>
      <td>gi-skill-catfacts</td>
      <td>Get a random cat fact loaded from a text file</td>
    </tr>

  </tbody>
</table>