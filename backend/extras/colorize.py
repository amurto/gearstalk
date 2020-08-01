import nltk
from nltk.tokenize import word_tokenize
from matplotlib import colors
from nltk.stem import WordNetLemmatizer
from utils.colorlist import colours
import time

# nltk.download('punkt')
# nltk.download('wordnet')

lemmatizer = WordNetLemmatizer()
print(lemmatizer.lemmatize('Bluegreen'))
stopwords = ['The', 'sky', 'is']

start = time.time()
print([x[3] for x in colours])
print(time.time()-start)
# colors.to_rgba(color)
# colors.to_rgba_array(color)

def colorize(sent):
    tokens = word_tokenize(sent)
    prev = ""
    color_values = []
    features = []
    for token in tokens:
        lemmatizer.lemmatize(token)
        if len(token) > 1 and colors.is_color_like(token):
            if colors.is_color_like(prev + token):
                color_values.append(list(colors.to_rgba(prev + token)))
            else:
                color_values.append(list(colors.to_rgba(token)))
            prev = token
        elif token in stopwords:
            features.append(token) 
    return color_values,features


string = "red The sky blue is darkblue".lower()
print(colorize(string))


# from sklearn.metrics.pairwise import cosine_similarity
# import numpy as np



# a = [[0., 0., 1., 1.]]
# b = [[0., 1., 0.54509804], [0., 0., 1., 1.],[0., 1., 0.54509804, 0.],[0., 1., 0.58509804, 1.], [0., 0., 1., 1.],[0., 1., 0.54509804, 1.],[0.54509804, 1., 0.54509804, 1.]]

# cos_sim = cosine_similarity(a,b)
# print(cos_sim[0])
# x = np.nonzero(cos_sim[0] > 0.9)[0].tolist()
# print(x)