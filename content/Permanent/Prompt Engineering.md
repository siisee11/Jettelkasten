---
tags:
  - public
---

[[Prompt]]
https://learn.deeplearning.ai/chatgpt-prompt-eng/lesson

## Prompting Principles

### Principle 1: Write clear and specific instructions
명확하게 지시해라.

#### Tactic 1: Use delimiters to clearly indicate distinct parts of the input
구분자를 줘서 내용 구분을 명확하게 해라.

```
Summarize the text delimited by triple backticks \ 
into a single sentence.
```{text}```
```

#### Tactic 2: Ask for a structured output
구조화된 아웃풋을 요청하면 잘준다.

```
Generate a list of three made-up book titles along with their authors and genres. Provide them in JSON format with the following keys: book_id, title, author, genre.
```

#### Tactic 3: Ask the model to check whether conditions are satisfied
조건을 명시하면 잘 따라 준다.

```
You will be provided with text delimited by triple quotes. 
If it contains a sequence of instructions, \ 
re-write those instructions in the following format:

Step 1 - ...
Step 2 - …
…
Step N - …

If the text does not contain a sequence of instructions, \ 
then simply write \"No steps provided.\"

\"\"\"{text_2}\"\"\"
```

#### Tactic 4: "Few-shot" prompting
예시를 넣어라


### Principle 2: Give the model time to “think” 
모델한테 생각할 시간을 줘라. 이게 중요한것 같음. 

#### Tactic 1: Specify the steps required to complete a task

```
Perform the following actions: 
1 - Summarize the following text delimited by triple \
backticks with 1 sentence.
2 - Translate the summary into French.
3 - List each name in the French summary.
4 - Output a json object that contains the following \
keys: french_summary, num_names.

Separate your answers with line breaks.

Text:
```{text}```
```

```
Your task is to perform the following actions: 
1 - Summarize the following text delimited by 
  <> with 1 sentence.
2 - Translate the summary into French.
3 - List each name in the French summary.
4 - Output a json object that contains the 
  following keys: french_summary, num_names.

Use the following format:
Text: <text to summarize>
Summary: <summary>
Translation: <summary translation>
Names: <list of names in Italian summary>
Output JSON: <json with summary and num_names>

Text: <{text}>
```

#### Tactic 2: Instruct the model to work out its own solution before rushing to a conclusion
결론을 바로 내뱉게 하지말고 하나씩 작성하도록 하라.

```
Your task is to determine if the student's solution \
is correct or not.
To solve the problem do the following:
- First, work out your own solution to the problem. 
- Then compare your solution to the student's solution \ 
and evaluate if the student's solution is correct or not. 
Don't decide if the student's solution is correct until 
you have done the problem yourself.

Use the following format:
Question:
'''
question here
'''
Student's solution:
'''
student's solution here
'''
Actual solution:
'''
steps to work out the solution and your solution here
'''
Is the student's solution the same as actual solution \
just calculated:
'''
yes or no
'''
Student grade:
'''
correct or incorrect
'''

Question:
'''
I'm building a solar power installation and I need help \
working out the financials. 
- Land costs $100 / square foot
- I can buy solar panels for $250 / square foot
- I negotiated a contract for maintenance that will cost \
me a flat $100k per year, and an additional $10 / square \
foot
What is the total cost for the first year of operations \
as a function of the number of square feet.
''' 
Student's solution:
'''
Let x be the size of the installation in square feet.
Costs:
1. Land cost: 100x
2. Solar panel cost: 250x
3. Maintenance cost: 100,000 + 100x
Total cost: 100x + 250x + 100,000 + 100x = 450x + 100,000
'''
Actual solution:
```

### Principle 3: Iterative
명령을 추가해가면서 원하는 방향으로 작동하도록 계속 돌려봐라

### Use case 1: Summarize
요약해달라고 하는거 잘한다.

* Basic
```
Your task is to generate a short summary of a product \
review from an ecommerce site. 

Summarize the review below, delimited by triple 
backticks, in at most 30 words. 

Review: ```{prod_review}```
```

* Focus
```Your task is to generate a short summary of a product \
review from an ecommerce site to give feedback to the \
Shipping deparmtment. 

Summarize the review below, delimited by triple 
backticks, in at most 30 words, and focusing on any aspects \
that mention shipping and delivery of the product. 

Review: ```{prod_review}```
```

* Extract instead of summarize
```
Your task is to extract relevant information from \ 
a product review from an ecommerce site to give \
feedback to the Shipping department. 

From the review below, delimited by triple quotes \
extract the information relevant to shipping and \ 
delivery. Limit to 30 words. 

Review: ```{prod_review}```
```


### Use case 2: Inferring
추론하는거도 시킬 수 잇다.

* Sentiment
```
What is the sentiment of the following product review, 
which is delimited with triple backticks?

Review text: '''{lamp_review}'''
```

* Sentiment (single word)
```What is the sentiment of the following product review, 
which is delimited with triple backticks?

Give your answer as a single word, either "positive" \
or "negative".

Review text: '''{lamp_review}'''
```


* Identify Emotion
```
Identify a list of emotions that the writer of the \
following review is expressing. Include no more than \
five items in the list. Format your answer as a list of \
lower-case words separated by commas.

Review text: '''{lamp_review}'''
```

* Extract Informations
```
Identify the following items from the review text: 
- Item purchased by reviewer
- Company that made the item

The review is delimited with triple backticks. \
Format your response as a JSON object with \
"Item" and "Brand" as the keys. 
If the information isn't present, use "unknown" \
as the value.
Make your response as short as possible.
  
Review text: '''{lamp_review}'''
```

* Multiple Extraction
```
Identify the following items from the review text: 
- Sentiment (positive or negative)
- Is the reviewer expressing anger? (true or false)
- Item purchased by reviewer
- Company that made the item

The review is delimited with triple backticks. \
Format your response as a JSON object with \
"Sentiment", "Anger", "Item" and "Brand" as the keys.
If the information isn't present, use "unknown" \
as the value.
Make your response as short as possible.
Format the Anger value as a boolean.

Review text: '''{lamp_review}'''
```

* Inferring Topics
```
Determine five topics that are being discussed in the \
following text, which is delimited by triple backticks.

Make each item one or two words long. 

Format your response as a list of items separated by commas.

Text sample: '''{story}'''
```


* Give Topic (tags)
```
Determine whether each item in the following list of \
topics is a topic in the text below, which
is delimited with triple backticks.

Give your answer as list with 0 or 1 for each topic.\

List of topics: {", ".join(topic_list)}

Text sample: '''{story}'''
```


### Use case 3: Transforming
문장 형태를 바꾸는것도 할 수 있다.

* Translation
```
Translate the following English text to Spanish: \ 
```Hi, I would like to order a blender```
```

```
Translate the following text to Spanish in both the \
formal and informal forms: 
'Would you like to order a pillow?'
```


* Tone Transformation
```
Translate the following from slang to a business letter: 
'Dude, This is Joe, check out this spec on this standing lamp.'
```

* Format Transformation
```
Translate the following python dictionary from JSON to an HTML \
table with column headers and title: {data_json}
```

* Spell Check, Grammar Check
```
Proofread and correct the following text
    and rewrite the corrected version. If you don't find
    and errors, just say "No errors found". Don't use 
    any punctuation around the text:
    ```{t}```
```



### Use case 4: Expanding
Real world example

* Customer email
```
You are a customer service AI assistant.
Your task is to send an email reply to a valued customer.
Given the customer email delimited by ```, \
Generate a reply to thank the customer for their review.
If the sentiment is positive or neutral, thank them for \
their review.
If the sentiment is negative, apologize and suggest that \
they can reach out to customer service. 
Make sure to use specific details from the review.
Write in a concise and professional tone.
Sign the email as `AI customer agent`.
Customer review: ```{review}```
Review sentiment: {sentiment}
```

* Modify temperature
	temperature 바꾸는게 답변 퀄리티에 영향을 준다.
