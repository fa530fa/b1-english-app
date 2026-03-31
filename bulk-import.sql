-- B1 English Prep - Bulk Import from Word Document
-- Generated from extracted Word document content
-- Run in Supabase SQL Editor
-- Profiles: 'waikwan' (Wai Kwan Wong - wife) and 'poping' (Po Ping Tang - husband)

DO $$
DECLARE
  -- Category IDs for waikwan
  wk_retired UUID;
  wk_food UUID;
  wk_daughter UUID;
  wk_pet UUID;
  wk_house UUID;
  wk_husband UUID;
  wk_common UUID;
  wk_exam UUID;
  wk_music UUID;
  wk_festival UUID;
  wk_freetime UUID;

  -- Category IDs for poping
  pp_retired UUID;
  pp_food UUID;
  pp_daughter UUID;
  pp_pet UUID;
  pp_house UUID;
  pp_wife UUID;
  pp_common UUID;
  pp_exam UUID;
  pp_music UUID;
  pp_festival UUID;
  pp_freetime UUID;

BEGIN

  -- ============================================================
  -- STEP 1: INSERT CATEGORIES
  -- ============================================================

  -- waikwan categories
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'waikwan', '退休 Retired', '#4E7C5F', 1) RETURNING id INTO wk_retired;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'waikwan', '食物 Food', '#C4903A', 2) RETURNING id INTO wk_food;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'waikwan', '女兒 My Daughter', '#3B82F6', 3) RETURNING id INTO wk_daughter;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'waikwan', '寵物 My Pet', '#8B5CF6', 4) RETURNING id INTO wk_pet;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'waikwan', '房子 My House', '#4E7C5F', 5) RETURNING id INTO wk_house;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'waikwan', '丈夫 My Husband', '#C4903A', 6) RETURNING id INTO wk_husband;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'waikwan', '常見問題 Common Questions', '#3B82F6', 7) RETURNING id INTO wk_common;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'waikwan', '考試 Examination', '#4E7C5F', 8) RETURNING id INTO wk_exam;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'waikwan', '音樂 Music', '#8B5CF6', 9) RETURNING id INTO wk_music;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'waikwan', '節日 Festival', '#10B981', 10) RETURNING id INTO wk_festival;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'waikwan', '空閒活動 Free Time', '#10B981', 11) RETURNING id INTO wk_freetime;

  -- poping categories
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'poping', '退休 Retired', '#4E7C5F', 1) RETURNING id INTO pp_retired;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'poping', '食物 Food', '#C4903A', 2) RETURNING id INTO pp_food;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'poping', '女兒 My Daughter', '#3B82F6', 3) RETURNING id INTO pp_daughter;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'poping', '寵物 My Pet', '#8B5CF6', 4) RETURNING id INTO pp_pet;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'poping', '房子 My House', '#4E7C5F', 5) RETURNING id INTO pp_house;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'poping', '太太 My Wife', '#C4903A', 6) RETURNING id INTO pp_wife;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'poping', '常見問題 Common Questions', '#3B82F6', 7) RETURNING id INTO pp_common;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'poping', '考試 Examination', '#4E7C5F', 8) RETURNING id INTO pp_exam;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'poping', '音樂 Music', '#8B5CF6', 9) RETURNING id INTO pp_music;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'poping', '節日 Festival', '#10B981', 10) RETURNING id INTO pp_festival;
  INSERT INTO categories (id, profile, name, color, sort_order) VALUES (gen_random_uuid(), 'poping', '空閒活動 Free Time', '#10B981', 11) RETURNING id INTO pp_freetime;

  -- ============================================================
  -- STEP 2: INSERT CARDS
  -- ============================================================

  -- ----------------------------------------------------------
  -- CATEGORY: 退休 Retired (shared - both profiles)
  -- Source: 退休 tab (10 Q&A)
  -- ----------------------------------------------------------
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'waikwan', wk_retired, 'What do you do?', '你做什麼工作？', 'I am retired.', '我已經退休了。'),
  (gen_random_uuid(), 'waikwan', wk_retired, 'What did you do before?', '你以前做什麼？', 'I worked in an office.', '我以前在辦公室工作。'),
  (gen_random_uuid(), 'waikwan', wk_retired, 'What do you usually do every day?', '你每天通常做什麼？', 'I stay at home and take care of my family.', '我在家，照顧家人。'),
  (gen_random_uuid(), 'waikwan', wk_retired, 'Do you like your life now?', '你喜歡現在的生活嗎？', 'Yes, I like my life. It is simple and happy.', '是的，我喜歡現在的生活。很簡單也很開心。'),
  (gen_random_uuid(), 'waikwan', wk_retired, 'What do you do in your free time?', '你空閒時間做什麼？', 'I watch TV and go for a walk.', '我看電視和散步。'),
  (gen_random_uuid(), 'waikwan', wk_retired, 'Do you go out often?', '你常常外出嗎？', 'Yes, sometimes I go out for a walk.', '是的，有時我會出去散步。'),
  (gen_random_uuid(), 'waikwan', wk_retired, 'Who do you spend time with?', '你和誰一起度過時間？', 'I spend time with my husband and my daughter.', '我和丈夫還有女兒一起。'),
  (gen_random_uuid(), 'waikwan', wk_retired, 'Do you help your family?', '你會幫助家人嗎？', 'Yes, I help my family. I take care of them.', '是的，我會幫助家人。我照顧他們。'),
  (gen_random_uuid(), 'waikwan', wk_retired, 'What do you like about your life?', '你喜歡現在生活的什麼？', 'I like that my life is quiet and comfortable.', '我喜歡現在生活安靜又舒服。'),
  (gen_random_uuid(), 'waikwan', wk_retired, 'Are you busy every day?', '你每天忙嗎？', 'No, I am not very busy. My life is simple.', '不，我不太忙。我的生活很簡單。');

  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'poping', pp_retired, 'What do you do?', '你做什麼工作？', 'I am retired.', '我已經退休了。'),
  (gen_random_uuid(), 'poping', pp_retired, 'What did you do before?', '你以前做什麼？', 'I worked in an office.', '我以前在辦公室工作。'),
  (gen_random_uuid(), 'poping', pp_retired, 'What do you usually do every day?', '你每天通常做什麼？', 'I stay at home and take care of my family.', '我在家，照顧家人。'),
  (gen_random_uuid(), 'poping', pp_retired, 'Do you like your life now?', '你喜歡現在的生活嗎？', 'Yes, I like my life. It is simple and happy.', '是的，我喜歡現在的生活。很簡單也很開心。'),
  (gen_random_uuid(), 'poping', pp_retired, 'What do you do in your free time?', '你空閒時間做什麼？', 'I watch TV and go for a walk.', '我看電視和散步。'),
  (gen_random_uuid(), 'poping', pp_retired, 'Do you go out often?', '你常常外出嗎？', 'Yes, sometimes I go out for a walk.', '是的，有時我會出去散步。'),
  (gen_random_uuid(), 'poping', pp_retired, 'Who do you spend time with?', '你和誰一起度過時間？', 'I spend time with my wife and my daughter.', '我和太太還有女兒一起。'),
  (gen_random_uuid(), 'poping', pp_retired, 'Do you help your family?', '你會幫助家人嗎？', 'Yes, I help my family. I take care of them.', '是的，我會幫助家人。我照顧他們。'),
  (gen_random_uuid(), 'poping', pp_retired, 'What do you like about your life?', '你喜歡現在生活的什麼？', 'I like that my life is quiet and comfortable.', '我喜歡現在生活安靜又舒服。'),
  (gen_random_uuid(), 'poping', pp_retired, 'Are you busy every day?', '你每天忙嗎？', 'No, I am not very busy. My life is simple.', '不，我不太忙。我的生活很簡單。');

  -- ----------------------------------------------------------
  -- CATEGORY: 食物 Food (shared - both profiles)
  -- Source: My favorite food tab (14 Q&A)
  -- ----------------------------------------------------------
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'waikwan', wk_food, 'What is your favourite food?', '你最喜歡的食物是什麼？', 'My favourite food is Chinese food.', '我喜歡的食物是中國菜。'),
  (gen_random_uuid(), 'waikwan', wk_food, 'Why do you like it?', '你為什麼喜歡它？', 'Because it is very delicious.', '因為它很好吃。'),
  (gen_random_uuid(), 'waikwan', wk_food, 'Do you know how to cook your favourite food?', '你會做你最喜歡的食物嗎？', 'Yes, I know how to cook my favourite food.', '是的，我知道怎樣做我喜歡的食物。'),
  (gen_random_uuid(), 'waikwan', wk_food, 'How often do you cook it?', '你多久煮一次？', 'I cook it every day.', '我每天都煮。'),
  (gen_random_uuid(), 'waikwan', wk_food, 'Who taught you how to cook?', '誰教你煮飯？', 'My mother taught me.', '我媽媽教我。'),
  (gen_random_uuid(), 'waikwan', wk_food, 'Who do you eat it with?', '你和誰一起吃？', 'I eat with my friends and family.', '我跟朋友和家人一起吃。'),
  (gen_random_uuid(), 'waikwan', wk_food, 'Where do you learn new recipes?', '你從哪裡學習新食譜？', 'I learn from the internet and YouTube.', '我透過網絡和YouTube學習。'),
  (gen_random_uuid(), 'waikwan', wk_food, 'Can you share a recent experience of cooking something new?', '能分享一下最近嘗試的新食譜嗎？', 'Yes, recently I cooked fried rice. I fried the rice with egg. It was very tasty.', '是的，我煮了炒飯。我把飯和雞蛋一起炒，很好吃。'),
  (gen_random_uuid(), 'waikwan', wk_food, 'Do you like to eat out?', '你喜歡在外面吃飯嗎？', 'Yes, I like to eat out.', '是的，我喜歡在外邊吃飯。'),
  (gen_random_uuid(), 'waikwan', wk_food, 'Do you like to eat out your favourite food?', '你喜歡在外邊吃你最喜歡的食物嗎？', 'Yes, sometimes on special days, I like to go to a Chinese restaurant to eat my favourite food.', '是的，有時候在特別的日子裡，我喜歡在中餐館吃最喜愛的菜。'),
  (gen_random_uuid(), 'waikwan', wk_food, 'What kind of food do you like to eat on special days?', '你在特殊日子裡喜歡吃什麼食物？', 'I like to eat traditional Chinese food on special days like birthday parties and anniversaries.', '我喜歡在生日派對、週年紀念日等特殊日子裡吃傳統的中國菜。'),
  (gen_random_uuid(), 'waikwan', wk_food, 'Is your favourite food healthy?', '你最喜歡的食物健康嗎？', 'Yes, it is healthy.', '是的，它很健康。'),
  (gen_random_uuid(), 'waikwan', wk_food, 'What dessert do you like?', '你喜歡什麼甜品？', 'I like ice cream.', '我喜歡雪糕。'),
  (gen_random_uuid(), 'waikwan', wk_food, 'What drink do you like?', '你喜歡什麼飲品？', 'I like green tea.', '我喜歡綠茶。');

  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'poping', pp_food, 'What is your favourite food?', '你最喜歡的食物是什麼？', 'My favourite food is Chinese food.', '我喜歡的食物是中國菜。'),
  (gen_random_uuid(), 'poping', pp_food, 'Why do you like it?', '你為什麼喜歡它？', 'Because it is very delicious.', '因為它很好吃。'),
  (gen_random_uuid(), 'poping', pp_food, 'Do you know how to cook your favourite food?', '你會做你最喜歡的食物嗎？', 'Yes, I know how to cook my favourite food.', '是的，我知道怎樣做我喜歡的食物。'),
  (gen_random_uuid(), 'poping', pp_food, 'How often do you cook it?', '你多久煮一次？', 'I cook it every day.', '我每天都煮。'),
  (gen_random_uuid(), 'poping', pp_food, 'Who taught you how to cook?', '誰教你煮飯？', 'My mother taught me.', '我媽媽教我。'),
  (gen_random_uuid(), 'poping', pp_food, 'Who do you eat it with?', '你和誰一起吃？', 'I eat with my friends and family.', '我跟朋友和家人一起吃。'),
  (gen_random_uuid(), 'poping', pp_food, 'Where do you learn new recipes?', '你從哪裡學習新食譜？', 'I learn from the internet and YouTube.', '我透過網絡和YouTube學習。'),
  (gen_random_uuid(), 'poping', pp_food, 'Can you share a recent experience of cooking something new?', '能分享一下最近嘗試的新食譜嗎？', 'Yes, recently I cooked fried rice. I fried the rice with egg. It was very tasty.', '是的，我煮了炒飯。我把飯和雞蛋一起炒，很好吃。'),
  (gen_random_uuid(), 'poping', pp_food, 'Do you like to eat out?', '你喜歡在外面吃飯嗎？', 'Yes, I like to eat out.', '是的，我喜歡在外邊吃飯。'),
  (gen_random_uuid(), 'poping', pp_food, 'Do you like to eat out your favourite food?', '你喜歡在外邊吃你最喜歡的食物嗎？', 'Yes, sometimes on special days, I like to go to a Chinese restaurant to eat my favourite food.', '是的，有時候在特別的日子裡，我喜歡在中餐館吃最喜愛的菜。'),
  (gen_random_uuid(), 'poping', pp_food, 'What kind of food do you like to eat on special days?', '你在特殊日子裡喜歡吃什麼食物？', 'I like to eat traditional Chinese food on special days like birthday parties and anniversaries.', '我喜歡在生日派對、週年紀念日等特殊日子裡吃傳統的中國菜。'),
  (gen_random_uuid(), 'poping', pp_food, 'Is your favourite food healthy?', '你最喜歡的食物健康嗎？', 'Yes, it is healthy.', '是的，它很健康。'),
  (gen_random_uuid(), 'poping', pp_food, 'What dessert do you like?', '你喜歡什麼甜品？', 'I like ice cream.', '我喜歡雪糕。'),
  (gen_random_uuid(), 'poping', pp_food, 'What drink do you like?', '你喜歡什麼飲品？', 'I like green tea.', '我喜歡綠茶。');

  -- ----------------------------------------------------------
  -- CATEGORY: 女兒 My Daughter (shared - both profiles)
  -- Source: My daughter v2 (40 Q&A) as primary, unique from v1 added
  -- ----------------------------------------------------------
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Do you have a daughter?', '你有女兒嗎？', 'Yes, I have a daughter.', '是的，我有一個女兒。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'How old is your daughter?', '你的女兒幾歲？', 'She is twenty-six years old.', '她二十六歲。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What is your daughter''s name?', '你女兒叫什麼名字？', 'Her name is Jojo.', '她叫Jojo。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What does your daughter look like?', '你女兒長什麼樣？', 'She is tall and slim. She has brown hair and black eyes.', '她高瘦。她有棕色的頭髮和黑色的眼睛。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What does your daughter like to do?', '你的女兒喜歡做什麼？', 'She likes reading and travelling.', '她喜歡看書和旅行。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What is your daughter''s job?', '你的女兒做什麼工作？', 'She works as an accountant.', '她是會計師。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'How does your daughter go to work?', '你的女兒怎麼去上班？', 'She drives to work.', '她開車去上班。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'How long does it take her to go to work?', '她上班要多久？', 'It takes ten minutes to drive.', '她需要十分鐘。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like her job?', '你的女兒喜歡她的工作嗎？', 'Yes, she likes it.', '是的，她喜歡。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter have friends at work?', '她在工作有朋友嗎？', 'Yes, she has friends at work.', '是的，她有工作上的朋友。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What does your daughter like to eat?', '你的女兒喜歡吃什麼？', 'She likes healthy food.', '她喜歡健康食物。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like sports?', '她喜歡運動嗎？', 'Yes, she likes yoga.', '是的，她喜歡瑜伽。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What is your daughter''s favourite colour?', '她最喜歡的顏色是什麼？', 'Her favourite colour is pink.', '她最喜歡粉紅色。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like pets?', '她喜歡寵物嗎？', 'Yes, she likes cats and dogs.', '是的，她喜歡貓和狗。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Where does your daughter live?', '她住在哪裡？', 'We live together.', '我們一起住。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like reading?', '她喜歡看書嗎？', 'Yes, she likes novels.', '是的，她喜歡小說。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like travelling?', '她喜歡旅遊嗎？', 'Yes, she likes to travel. She especially likes Japan.', '是的，她喜歡旅遊。她特別喜歡去日本。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What does your daughter usually do on weekends?', '她週末通常做什麼？', 'She relaxes and meets friends. She also does yoga and walks in the park.', '她休息，也會見朋友。她也做瑜伽，會在公園散步。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter have a boyfriend?', '她有男朋友嗎？', 'Yes, she has a boyfriend.', '是的，她有男朋友。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'How does your daughter make you feel?', '你的女兒讓你感覺如何？', 'She makes me very proud.', '她讓我非常驕傲。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like cooking?', '她喜歡做飯嗎？', 'Yes, sometimes she cooks at home.', '她有時會在家煮飯。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter use social media?', '她用社交媒體嗎？', 'Yes, she uses it every day.', '是的，她每天用。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like movies?', '她喜歡看電影嗎？', 'Yes, she likes movies.', '是的，她喜歡電影。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What does your daughter do in the evening?', '她晚上做什麼？', 'She reads or watches TV.', '她看書或看電視。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter travel by car often?', '她常開車嗎？', 'Yes, she drives to work.', '是的，她開車去上班。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like music?', '她喜歡音樂嗎？', 'Yes, she likes pop music.', '是的，她喜歡流行音樂。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter exercise?', '她有運動嗎？', 'Yes, she does yoga and runs.', '是的，她做瑜伽，也跑步。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'How often does your daughter visit you?', '她多久來看你一次？', 'She visits me every week.', '她每週來看我一次。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter help at home?', '她會幫忙做家務嗎？', 'Sometimes she helps.', '她有時會幫忙。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like shopping?', '她喜歡購物嗎？', 'Yes, she likes shopping.', '是的，她喜歡購物。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What kind of clothes does your daughter like?', '她喜歡穿什麼衣服？', 'She likes casual clothes.', '她喜歡休閒服。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What is your daughter''s favourite food?', '她最喜歡的食物是什麼？', 'She likes ice cream. She also likes pasta and salad.', '她喜歡雪糕。她也喜歡意粉和沙拉。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like parties?', '她喜歡聚會嗎？', 'Yes, sometimes she does.', '是的，有時喜歡聚會。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like coffee?', '她喜歡咖啡嗎？', 'Yes, she likes coffee.', '是的，她喜歡咖啡。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like reading the news?', '她喜歡看新聞嗎？', 'Sometimes she reads the news.', '有時候看新聞。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter have hobbies?', '她有興趣嗎？', 'Yes, she likes painting.', '是的，她喜歡畫畫。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What does your daughter do after work?', '她下班後做什麼？', 'She relaxes and watches TV.', '她休息，看電視。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'How often does your daughter exercise?', '她多久運動一次？', 'She exercises three times a week.', '她每週運動三次。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What do you want for your daughter?', '你希望你的女兒怎麼樣？', 'I want her to be happy and healthy.', '我希望她快樂健康。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What is your daughter like?', '你女兒性格怎樣？', 'She is friendly and hardworking.', '她很友善，也很努力。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like animals?', '她喜歡動物嗎？', 'Yes, she loves animals. She has a cat.', '是的，她很喜歡動物。她有一隻貓。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'Does your daughter like learning new things?', '她喜歡學新東西嗎？', 'Yes, she likes learning new things.', '是的，她喜歡學新東西。'),
  (gen_random_uuid(), 'waikwan', wk_daughter, 'What makes your daughter happy?', '什麼讓你女兒開心？', 'Playing with her cat and travelling makes her happy.', '跟貓玩和旅遊讓她很開心。');

  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'poping', pp_daughter, 'Do you have a daughter?', '你有女兒嗎？', 'Yes, I have a daughter.', '是的，我有一個女兒。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'How old is your daughter?', '你的女兒幾歲？', 'She is twenty-six years old.', '她二十六歲。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What is your daughter''s name?', '你女兒叫什麼名字？', 'Her name is Jojo.', '她叫Jojo。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What does your daughter look like?', '你女兒長什麼樣？', 'She is tall and slim. She has brown hair and black eyes.', '她高瘦。她有棕色的頭髮和黑色的眼睛。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What does your daughter like to do?', '你的女兒喜歡做什麼？', 'She likes reading and travelling.', '她喜歡看書和旅行。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What is your daughter''s job?', '你的女兒做什麼工作？', 'She works as an accountant.', '她是會計師。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'How does your daughter go to work?', '你的女兒怎麼去上班？', 'She drives to work.', '她開車去上班。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'How long does it take her to go to work?', '她上班要多久？', 'It takes ten minutes to drive.', '她需要十分鐘。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like her job?', '你的女兒喜歡她的工作嗎？', 'Yes, she likes it.', '是的，她喜歡。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter have friends at work?', '她在工作有朋友嗎？', 'Yes, she has friends at work.', '是的，她有工作上的朋友。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What does your daughter like to eat?', '你的女兒喜歡吃什麼？', 'She likes healthy food.', '她喜歡健康食物。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like sports?', '她喜歡運動嗎？', 'Yes, she likes yoga.', '是的，她喜歡瑜伽。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What is your daughter''s favourite colour?', '她最喜歡的顏色是什麼？', 'Her favourite colour is pink.', '她最喜歡粉紅色。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like pets?', '她喜歡寵物嗎？', 'Yes, she likes cats and dogs.', '是的，她喜歡貓和狗。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Where does your daughter live?', '她住在哪裡？', 'We live together.', '我們一起住。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like reading?', '她喜歡看書嗎？', 'Yes, she likes novels.', '是的，她喜歡小說。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like travelling?', '她喜歡旅遊嗎？', 'Yes, she likes to travel. She especially likes Japan.', '是的，她喜歡旅遊。她特別喜歡去日本。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What does your daughter usually do on weekends?', '她週末通常做什麼？', 'She relaxes and meets friends. She also does yoga and walks in the park.', '她休息，也會見朋友。她也做瑜伽，會在公園散步。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter have a boyfriend?', '她有男朋友嗎？', 'Yes, she has a boyfriend.', '是的，她有男朋友。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'How does your daughter make you feel?', '你的女兒讓你感覺如何？', 'She makes me very proud.', '她讓我非常驕傲。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like cooking?', '她喜歡做飯嗎？', 'Yes, sometimes she cooks at home.', '她有時會在家煮飯。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter use social media?', '她用社交媒體嗎？', 'Yes, she uses it every day.', '是的，她每天用。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like movies?', '她喜歡看電影嗎？', 'Yes, she likes movies.', '是的，她喜歡電影。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What does your daughter do in the evening?', '她晚上做什麼？', 'She reads or watches TV.', '她看書或看電視。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter travel by car often?', '她常開車嗎？', 'Yes, she drives to work.', '是的，她開車去上班。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like music?', '她喜歡音樂嗎？', 'Yes, she likes pop music.', '是的，她喜歡流行音樂。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter exercise?', '她有運動嗎？', 'Yes, she does yoga and runs.', '是的，她做瑜伽，也跑步。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'How often does your daughter visit you?', '她多久來看你一次？', 'She visits me every week.', '她每週來看我一次。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter help at home?', '她會幫忙做家務嗎？', 'Sometimes she helps.', '她有時會幫忙。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like shopping?', '她喜歡購物嗎？', 'Yes, she likes shopping.', '是的，她喜歡購物。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What kind of clothes does your daughter like?', '她喜歡穿什麼衣服？', 'She likes casual clothes.', '她喜歡休閒服。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What is your daughter''s favourite food?', '她最喜歡的食物是什麼？', 'She likes ice cream. She also likes pasta and salad.', '她喜歡雪糕。她也喜歡意粉和沙拉。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like parties?', '她喜歡聚會嗎？', 'Yes, sometimes she does.', '是的，有時喜歡聚會。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like coffee?', '她喜歡咖啡嗎？', 'Yes, she likes coffee.', '是的，她喜歡咖啡。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like reading the news?', '她喜歡看新聞嗎？', 'Sometimes she reads the news.', '有時候看新聞。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter have hobbies?', '她有興趣嗎？', 'Yes, she likes painting.', '是的，她喜歡畫畫。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What does your daughter do after work?', '她下班後做什麼？', 'She relaxes and watches TV.', '她休息，看電視。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'How often does your daughter exercise?', '她多久運動一次？', 'She exercises three times a week.', '她每週運動三次。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What do you want for your daughter?', '你希望你的女兒怎麼樣？', 'I want her to be happy and healthy.', '我希望她快樂健康。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What is your daughter like?', '你女兒性格怎樣？', 'She is friendly and hardworking.', '她很友善，也很努力。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like animals?', '她喜歡動物嗎？', 'Yes, she loves animals. She has a cat.', '是的，她很喜歡動物。她有一隻貓。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'Does your daughter like learning new things?', '她喜歡學新東西嗎？', 'Yes, she likes learning new things.', '是的，她喜歡學新東西。'),
  (gen_random_uuid(), 'poping', pp_daughter, 'What makes your daughter happy?', '什麼讓你女兒開心？', 'Playing with her cat and travelling makes her happy.', '跟貓玩和旅遊讓她很開心。');

  -- ----------------------------------------------------------
  -- CATEGORY: 寵物 My Pet (shared - both profiles)
  -- Source: Pet 2 (40 Q&A) as primary, unique from Pet v1 added
  -- ----------------------------------------------------------
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'waikwan', wk_pet, 'Do you have a pet?', '你有寵物嗎？', 'Yes, I have a cat. She is very cute and friendly.', '我有一隻貓。牠很可愛，也很友善。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'What is your pet''s name?', '你的寵物叫什麼名字？', 'My cat''s name is Bobo. I chose this name because it sounds nice.', '我的貓叫做Bobo。我選這個名字因為它聽起來很可愛。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'How old is your pet?', '你的寵物幾歲？', 'Bobo is two years old. I have had her for two years.', 'Bobo兩歲。我養牠兩年了。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'What kind of pet do you have?', '你養什麼寵物？', 'I have a small cat. She is easy to look after.', '我有一隻貓，牠很容易照顧。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'What does your pet look like?', '你的寵物長什麼樣？', 'She is small and white. She has big eyes and soft fur.', '牠小小的，白色。牠有大眼睛和柔軟的毛。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'What does your pet like to do?', '牠喜歡做什麼？', 'She likes to sleep and play. Sometimes she runs around the house.', '牠喜歡睡覺和玩。有時會在家裡跑來跑去。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'What do you usually do with your pet?', '你通常和牠做什麼？', 'I play with her every day. I also brush her fur.', '我每天跟牠玩。我也會幫牠梳毛。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Where does your pet sleep?', '牠睡在哪裡？', 'She sleeps in a small bed. The bed is near my bed.', '牠睡在小床上，小床在我床旁邊。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'What does your pet eat?', '牠吃什麼？', 'She eats cat food, small treats, and fish. She likes fish very much.', '牠吃貓糧、小食和魚。牠最喜歡魚。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'How often do you feed your pet?', '你多久餵一次？', 'I feed her twice a day. I also give her fresh water every day.', '我每天餵兩次。我每天也給牠新鮮的水。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Do you take your pet outside?', '你會帶寵物出去嗎？', 'Sometimes I take her outside. She looks very happy.', '有時我帶牠出去。牠看起來很開心。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Does your pet like people?', '你的寵物喜歡人嗎？', 'Yes, she likes people. She is very friendly to everyone.', '是的，牠喜歡人。牠對每個人都很友善。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Does your pet make noise?', '牠會發出聲音嗎？', 'Yes, she meows loudly. She usually does that when she is hungry.', '是的，牠會大聲喵叫。通常肚子餓時會這樣。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Can your pet do any tricks?', '牠會表演嗎？', 'She can jump and run. She can also catch a small ball.', '牠會跳和跑。牠也會接小球。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'How do you take care of your pet?', '你怎樣照顧牠？', 'I give her food and clean her bed. I take her to the vet if she is sick.', '我餵食並清理牠的床。牠生病時我會帶牠看獸醫。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Do you love your pet?', '你愛你的寵物嗎？', 'Yes, I love her very much. She is like a family member.', '是的，我很愛牠。牠就像家人一樣。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Why do you like your pet?', '為什麼你喜歡牠？', 'Because she is cute and friendly. She always makes me happy.', '因為牠可愛又友善。牠總是讓我開心。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'How long have you had your pet?', '你養多久了？', 'I have had her for two years. I got her when she was a baby.', '我養牠兩年了。我在牠還是小貓時養牠。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Does your pet sleep a lot?', '牠很愛睡嗎？', 'Yes, she sleeps a lot. She sleeps about twelve hours a day.', '是的，牠很愛睡。牠每天大約睡十二小時。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Does your pet like toys?', '牠喜歡玩具嗎？', 'Yes, she likes small balls. She also likes soft toys.', '是的，牠喜歡小球。牠也喜歡軟玩具。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Do you take photos of your pet?', '你會拍照片嗎？', 'Yes, I take many photos. I keep them on my phone.', '是的，我拍很多照片。我把照片存在手機裡。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Does your pet like water?', '牠喜歡水嗎？', 'No, she does not like water. She runs away when I wash her.', '不，牠不喜歡水。我幫牠洗時牠會跑走。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Do you walk your pet?', '你會帶牠散步嗎？', 'Sometimes I walk her outside. She looks very happy.', '有時我帶牠散步。牠看起來很開心。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Who looks after your pet?', '誰照顧牠？', 'I look after her every day. Sometimes my family helps me.', '我每天照顧牠。有時家人會幫忙。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Does your pet follow you?', '牠會跟著你嗎？', 'Yes, she follows me. She likes to stay near me.', '是的，牠會跟著我。牠喜歡待在我身邊。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Where do you keep her toys?', '玩具放哪裡？', 'I keep them in a box. The box is in the living room.', '我把玩具放在箱子裡。箱子在客廳。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Does your pet have friends?', '牠有朋友嗎？', 'Yes, she has some cat friends. They play together sometimes.', '是的，牠有一些貓朋友。有時會一起玩。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Do you celebrate your pet''s birthday?', '你會慶祝牠的生日嗎？', 'Yes, I give her a small treat. I also take some photos.', '是的，我會給牠小零食。我也會拍照。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'How does your pet make you feel?', '牠讓你感覺如何？', 'She makes me happy. I feel relaxed when I play with her.', '牠讓我開心。和牠玩時我覺得放鬆。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Do you think pets are important?', '你覺得寵物重要嗎？', 'Yes, pets are important. They bring joy to our lives.', '是的，寵物很重要。牠們為我們帶來快樂。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Does your pet like other animals?', '牠喜歡其他動物嗎？', 'Yes, she likes other cats. She is not aggressive.', '是的，牠喜歡其他貓。牠不兇。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'How do you clean your pet?', '你如何清理牠？', 'I wash her sometimes. I also brush her fur every week.', '我有時會幫牠洗澡。我每星期也會梳毛。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Does your pet sleep with you?', '牠跟你睡嗎？', 'No, she sleeps in her own bed. But sometimes she comes to my room.', '不，牠睡自己的床。但有時會來我房間。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'What is your pet''s favourite food?', '牠最喜歡吃什麼？', 'She likes fish the most. She eats it very quickly.', '牠最喜歡魚。牠吃得很快。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'How many pets do you have?', '你有幾隻寵物？', 'I have one pet. I want another one in the future.', '我有一隻寵物。我將來想再養一隻。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Would you like another pet?', '你想再養一隻嗎？', 'Yes, I would like another cat. I think two pets are more fun.', '是的，我想再養一隻。我覺得兩隻更好玩。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Is your pet friendly?', '牠友善嗎？', 'Yes, she is very friendly. She likes to sit next to people.', '是的，牠很友善。牠喜歡坐在人旁邊。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Is it easy to look after your pet?', '容易照顧嗎？', 'Yes, it is easy to look after. She does not need too much time.', '是的，很容易照顧。牠不需要太多時間。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'What do you do when your pet is sick?', '牠生病時怎麼辦？', 'I take her to the vet. I feel worried when she is sick.', '我會帶牠看獸醫。牠生病時我會擔心。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Would you recommend having a pet?', '你會建議養寵物嗎？', 'Yes, having a pet is fun and makes me happy. She is a good companion.', '是的，養寵物很有趣，也讓我開心。牠是很好的陪伴。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Where did you get your pet?', '你的寵物從哪裡來的？', 'I got her from my friend.', '我從朋友那裡得到牠的。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'What is your pet''s favourite activity?', '你寵物最喜歡的活動是什麼？', 'My cat likes playing with balls and sleeping.', '我的貓喜歡玩球和睡覺。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'What do you like most about your pet?', '你最喜歡寵物什麼？', 'I like that she is friendly and playful.', '我喜歡牠很友善又好玩。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'What is a funny thing your pet does?', '你的寵物有什麼好笑的事？', 'She often chases her tail and makes silly noises.', '牠經常追自己的尾巴，還會發出搞笑的聲音。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'Is your pet afraid of anything?', '你的寵物怕什麼？', 'She is afraid of loud noises and cars.', '牠怕大聲的噪音和汽車。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'How do you keep your pet healthy?', '你怎樣保持寵物健康？', 'I keep her healthy by feeding her good food, taking her for regular vet check-ups, and giving her exercise.', '我給牠吃好的食物、定期帶牠看獸醫和讓牠運動來保持健康。'),
  (gen_random_uuid(), 'waikwan', wk_pet, 'What is your favourite memory with your pet?', '你和寵物最美好的回憶是什麼？', 'When we went to the garden and played in the grass.', '我們去花園在草地上玩的時候。');

  -- poping pet cards (same content)
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'poping', pp_pet, 'Do you have a pet?', '你有寵物嗎？', 'Yes, I have a cat. She is very cute and friendly.', '我有一隻貓。牠很可愛，也很友善。'),
  (gen_random_uuid(), 'poping', pp_pet, 'What is your pet''s name?', '你的寵物叫什麼名字？', 'My cat''s name is Bobo. I chose this name because it sounds nice.', '我的貓叫做Bobo。我選這個名字因為它聽起來很可愛。'),
  (gen_random_uuid(), 'poping', pp_pet, 'How old is your pet?', '你的寵物幾歲？', 'Bobo is two years old. I have had her for two years.', 'Bobo兩歲。我養牠兩年了。'),
  (gen_random_uuid(), 'poping', pp_pet, 'What kind of pet do you have?', '你養什麼寵物？', 'I have a small cat. She is easy to look after.', '我有一隻貓，牠很容易照顧。'),
  (gen_random_uuid(), 'poping', pp_pet, 'What does your pet look like?', '你的寵物長什麼樣？', 'She is small and white. She has big eyes and soft fur.', '牠小小的，白色。牠有大眼睛和柔軟的毛。'),
  (gen_random_uuid(), 'poping', pp_pet, 'What does your pet like to do?', '牠喜歡做什麼？', 'She likes to sleep and play. Sometimes she runs around the house.', '牠喜歡睡覺和玩。有時會在家裡跑來跑去。'),
  (gen_random_uuid(), 'poping', pp_pet, 'What do you usually do with your pet?', '你通常和牠做什麼？', 'I play with her every day. I also brush her fur.', '我每天跟牠玩。我也會幫牠梳毛。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Where does your pet sleep?', '牠睡在哪裡？', 'She sleeps in a small bed. The bed is near my bed.', '牠睡在小床上，小床在我床旁邊。'),
  (gen_random_uuid(), 'poping', pp_pet, 'What does your pet eat?', '牠吃什麼？', 'She eats cat food, small treats, and fish. She likes fish very much.', '牠吃貓糧、小食和魚。牠最喜歡魚。'),
  (gen_random_uuid(), 'poping', pp_pet, 'How often do you feed your pet?', '你多久餵一次？', 'I feed her twice a day. I also give her fresh water every day.', '我每天餵兩次。我每天也給牠新鮮的水。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Do you take your pet outside?', '你會帶寵物出去嗎？', 'Sometimes I take her outside. She looks very happy.', '有時我帶牠出去。牠看起來很開心。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Does your pet like people?', '你的寵物喜歡人嗎？', 'Yes, she likes people. She is very friendly to everyone.', '是的，牠喜歡人。牠對每個人都很友善。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Does your pet make noise?', '牠會發出聲音嗎？', 'Yes, she meows loudly. She usually does that when she is hungry.', '是的，牠會大聲喵叫。通常肚子餓時會這樣。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Can your pet do any tricks?', '牠會表演嗎？', 'She can jump and run. She can also catch a small ball.', '牠會跳和跑。牠也會接小球。'),
  (gen_random_uuid(), 'poping', pp_pet, 'How do you take care of your pet?', '你怎樣照顧牠？', 'I give her food and clean her bed. I take her to the vet if she is sick.', '我餵食並清理牠的床。牠生病時我會帶牠看獸醫。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Do you love your pet?', '你愛你的寵物嗎？', 'Yes, I love her very much. She is like a family member.', '是的，我很愛牠。牠就像家人一樣。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Why do you like your pet?', '為什麼你喜歡牠？', 'Because she is cute and friendly. She always makes me happy.', '因為牠可愛又友善。牠總是讓我開心。'),
  (gen_random_uuid(), 'poping', pp_pet, 'How long have you had your pet?', '你養多久了？', 'I have had her for two years. I got her when she was a baby.', '我養牠兩年了。我在牠還是小貓時養牠。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Does your pet sleep a lot?', '牠很愛睡嗎？', 'Yes, she sleeps a lot. She sleeps about twelve hours a day.', '是的，牠很愛睡。牠每天大約睡十二小時。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Does your pet like toys?', '牠喜歡玩具嗎？', 'Yes, she likes small balls. She also likes soft toys.', '是的，牠喜歡小球。牠也喜歡軟玩具。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Do you take photos of your pet?', '你會拍照片嗎？', 'Yes, I take many photos. I keep them on my phone.', '是的，我拍很多照片。我把照片存在手機裡。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Does your pet like water?', '牠喜歡水嗎？', 'No, she does not like water. She runs away when I wash her.', '不，牠不喜歡水。我幫牠洗時牠會跑走。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Do you walk your pet?', '你會帶牠散步嗎？', 'Sometimes I walk her outside. She looks very happy.', '有時我帶牠散步。牠看起來很開心。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Who looks after your pet?', '誰照顧牠？', 'I look after her every day. Sometimes my family helps me.', '我每天照顧牠。有時家人會幫忙。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Does your pet follow you?', '牠會跟著你嗎？', 'Yes, she follows me. She likes to stay near me.', '是的，牠會跟著我。牠喜歡待在我身邊。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Where do you keep her toys?', '玩具放哪裡？', 'I keep them in a box. The box is in the living room.', '我把玩具放在箱子裡。箱子在客廳。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Does your pet have friends?', '牠有朋友嗎？', 'Yes, she has some cat friends. They play together sometimes.', '是的，牠有一些貓朋友。有時會一起玩。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Do you celebrate your pet''s birthday?', '你會慶祝牠的生日嗎？', 'Yes, I give her a small treat. I also take some photos.', '是的，我會給牠小零食。我也會拍照。'),
  (gen_random_uuid(), 'poping', pp_pet, 'How does your pet make you feel?', '牠讓你感覺如何？', 'She makes me happy. I feel relaxed when I play with her.', '牠讓我開心。和牠玩時我覺得放鬆。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Do you think pets are important?', '你覺得寵物重要嗎？', 'Yes, pets are important. They bring joy to our lives.', '是的，寵物很重要。牠們為我們帶來快樂。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Does your pet like other animals?', '牠喜歡其他動物嗎？', 'Yes, she likes other cats. She is not aggressive.', '是的，牠喜歡其他貓。牠不兇。'),
  (gen_random_uuid(), 'poping', pp_pet, 'How do you clean your pet?', '你如何清理牠？', 'I wash her sometimes. I also brush her fur every week.', '我有時會幫牠洗澡。我每星期也會梳毛。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Does your pet sleep with you?', '牠跟你睡嗎？', 'No, she sleeps in her own bed. But sometimes she comes to my room.', '不，牠睡自己的床。但有時會來我房間。'),
  (gen_random_uuid(), 'poping', pp_pet, 'What is your pet''s favourite food?', '牠最喜歡吃什麼？', 'She likes fish the most. She eats it very quickly.', '牠最喜歡魚。牠吃得很快。'),
  (gen_random_uuid(), 'poping', pp_pet, 'How many pets do you have?', '你有幾隻寵物？', 'I have one pet. I want another one in the future.', '我有一隻寵物。我將來想再養一隻。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Would you like another pet?', '你想再養一隻嗎？', 'Yes, I would like another cat. I think two pets are more fun.', '是的，我想再養一隻。我覺得兩隻更好玩。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Is your pet friendly?', '牠友善嗎？', 'Yes, she is very friendly. She likes to sit next to people.', '是的，牠很友善。牠喜歡坐在人旁邊。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Is it easy to look after your pet?', '容易照顧嗎？', 'Yes, it is easy to look after. She does not need too much time.', '是的，很容易照顧。牠不需要太多時間。'),
  (gen_random_uuid(), 'poping', pp_pet, 'What do you do when your pet is sick?', '牠生病時怎麼辦？', 'I take her to the vet. I feel worried when she is sick.', '我會帶牠看獸醫。牠生病時我會擔心。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Would you recommend having a pet?', '你會建議養寵物嗎？', 'Yes, having a pet is fun and makes me happy. She is a good companion.', '是的，養寵物很有趣，也讓我開心。牠是很好的陪伴。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Where did you get your pet?', '你的寵物從哪裡來的？', 'I got her from my friend.', '我從朋友那裡得到牠的。'),
  (gen_random_uuid(), 'poping', pp_pet, 'What is your pet''s favourite activity?', '你寵物最喜歡的活動是什麼？', 'My cat likes playing with balls and sleeping.', '我的貓喜歡玩球和睡覺。'),
  (gen_random_uuid(), 'poping', pp_pet, 'What do you like most about your pet?', '你最喜歡寵物什麼？', 'I like that she is friendly and playful.', '我喜歡牠很友善又好玩。'),
  (gen_random_uuid(), 'poping', pp_pet, 'What is a funny thing your pet does?', '你的寵物有什麼好笑的事？', 'She often chases her tail and makes silly noises.', '牠經常追自己的尾巴，還會發出搞笑的聲音。'),
  (gen_random_uuid(), 'poping', pp_pet, 'Is your pet afraid of anything?', '你的寵物怕什麼？', 'She is afraid of loud noises and cars.', '牠怕大聲的噪音和汽車。'),
  (gen_random_uuid(), 'poping', pp_pet, 'How do you keep your pet healthy?', '你怎樣保持寵物健康？', 'I keep her healthy by feeding her good food, taking her for regular vet check-ups, and giving her exercise.', '我給牠吃好的食物、定期帶牠看獸醫和讓牠運動來保持健康。'),
  (gen_random_uuid(), 'poping', pp_pet, 'What is your favourite memory with your pet?', '你和寵物最美好的回憶是什麼？', 'When we went to the garden and played in the grass.', '我們去花園在草地上玩的時候。');

  -- ----------------------------------------------------------
  -- CATEGORY: 房子 My House (shared - both profiles)
  -- Source: MY house tab + examination house questions (deduplicated)
  -- ----------------------------------------------------------
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'waikwan', wk_house, 'Can you tell me about your house?', '你能介紹一下你的房子嗎？', 'I live in Bristol with my family. We moved from Hong Kong about four years ago. Our house is not very big, but it is comfortable for us.', '我和家人住在布里斯托。我們大約四年前從香港搬來的。房子不是很大，但對我們來說很舒適。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'Do you live in a house or an apartment?', '你住的是房子還是公寓？', 'I live in a house with my family.', '我和家人住在一間房子裡。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'What is your house like?', '你的房子怎樣？', 'My house is small and cosy. It has two floors.', '我的房子小而溫馨。它有兩層。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'How many rooms does your house have?', '你的房子有多少個房間？', 'My house has three bedrooms, a living room, a kitchen, and bathrooms.', '我的房子有三間睡房、一間客廳、一間廚房和浴室。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'What colour are the walls in your house?', '你房子的牆壁是什麼顏色？', 'The walls in my house are painted white.', '我房子的牆壁是白色的。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'Do you have a garden?', '你有花園嗎？', 'Yes, I have a small garden behind my house.', '是的，我的房子後面有一個小花園。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'Is your house big or small?', '你的房子是大還是小？', 'My house is small, but it is comfortable for my family.', '我的房子很小，但對我的家人來說很舒適。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'What is the colour of your house?', '你的房子是什麼顏色？', 'My house is grey.', '我的房子是灰色的。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'Do you have a balcony?', '你有陽台嗎？', 'No, I do not have a balcony in my house.', '不，我的房子沒有陽台。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'Do you have a garage?', '你有車庫嗎？', 'Yes, I have a garage in my house.', '是的，我的房子有車庫。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'What is your favourite room?', '你最喜歡的房間是哪個？', 'My favourite room is the living room because I can watch TV and talk with my family.', '我最喜歡的房間是客廳，因為我可以看電視和跟家人聊天。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'What do you usually do in your bedroom?', '你通常在臥室做什麼？', 'I usually sleep, study, and use my phone in my bedroom.', '我通常在臥室睡覺、學習和用手機。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'Can you describe your living room?', '描述一下你的客廳？', 'My living room is big and bright. There is a sofa, a TV, and a table.', '我的客廳又大又明亮。有一張沙發、一台電視和一張桌子。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'Do you like your house? Why?', '你喜歡你的房子嗎？為什麼？', 'Yes, I like my house because it is clean and comfortable.', '是的，我喜歡我的房子，因為它乾淨又舒適。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'Is your house near your workplace?', '你的房子離工作地點近嗎？', 'Yes, it is quite near, so it is very convenient. It takes ten minutes to drive.', '是的，很近，所以很方便。開車只需十分鐘。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'What would you like to change about your house?', '你想改變房子的什麼？', 'I would like to have a bigger living room because it is small.', '我想要一個更大的客廳，因為現在的太小了。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'Do you prefer living in a house or an apartment?', '你喜歡住房子還是公寓？', 'I prefer living in a house because it is quieter and more roomy.', '我喜歡住房子，因為比較安靜，空間也比較大。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'What do you like doing at home?', '你在家喜歡做什麼？', 'I like cooking and spending time with my family.', '我喜歡煮飯和跟家人在一起。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'Do you cook every day?', '你每天都煮飯嗎？', 'Yes, I cook every day. I enjoy preparing meals for my family. Cooking helps me relax.', '是的，我每天都煮飯。我喜歡為家人準備飯菜。煮飯幫助我放鬆。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'Do you have neighbours?', '你有鄰居嗎？', 'Yes, I have very kind neighbours. They are friendly and sometimes we chat when we see each other.', '是的，我有很友善的鄰居。他們很友好，有時見面會聊天。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'How often do you clean your house?', '你多久打掃一次房子？', 'I clean my house every day.', '我每天都打掃房子。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'How many people live in your house?', '你的房子住幾個人？', 'Three people live in my house.', '我的房子住三個人。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'Have you decorated your house?', '你有裝飾房子嗎？', 'Yes, I have decorated my house with flowers, pictures, and curtains.', '是的，我用花、圖畫和窗簾裝飾了房子。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'Do you want to buy new furniture?', '你想買新傢具嗎？', 'Yes, I want to buy new furniture in the future.', '是的，我將來想買新傢具。'),
  (gen_random_uuid(), 'waikwan', wk_house, 'What kind of things do you have in your bedroom?', '你的臥室裡有什麼？', 'In my bedroom, I have a bed, a desk, a chair, and a wardrobe.', '我的臥室裡有一張床、一張書桌、一把椅子和一個衣櫃。');

  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'poping', pp_house, 'Can you tell me about your house?', '你能介紹一下你的房子嗎？', 'I live in Bristol with my family. We moved from Hong Kong about four years ago. Our house is not very big, but it is comfortable for us.', '我和家人住在布里斯托。我們大約四年前從香港搬來的。房子不是很大，但對我們來說很舒適。'),
  (gen_random_uuid(), 'poping', pp_house, 'Do you live in a house or an apartment?', '你住的是房子還是公寓？', 'I live in a house with my family.', '我和家人住在一間房子裡。'),
  (gen_random_uuid(), 'poping', pp_house, 'What is your house like?', '你的房子怎樣？', 'My house is small and cosy. It has two floors.', '我的房子小而溫馨。它有兩層。'),
  (gen_random_uuid(), 'poping', pp_house, 'How many rooms does your house have?', '你的房子有多少個房間？', 'My house has three bedrooms, a living room, a kitchen, and bathrooms.', '我的房子有三間睡房、一間客廳、一間廚房和浴室。'),
  (gen_random_uuid(), 'poping', pp_house, 'What colour are the walls in your house?', '你房子的牆壁是什麼顏色？', 'The walls in my house are painted white.', '我房子的牆壁是白色的。'),
  (gen_random_uuid(), 'poping', pp_house, 'Do you have a garden?', '你有花園嗎？', 'Yes, I have a small garden behind my house.', '是的，我的房子後面有一個小花園。'),
  (gen_random_uuid(), 'poping', pp_house, 'Is your house big or small?', '你的房子是大還是小？', 'My house is small, but it is comfortable for my family.', '我的房子很小，但對我的家人來說很舒適。'),
  (gen_random_uuid(), 'poping', pp_house, 'What is the colour of your house?', '你的房子是什麼顏色？', 'My house is grey.', '我的房子是灰色的。'),
  (gen_random_uuid(), 'poping', pp_house, 'Do you have a balcony?', '你有陽台嗎？', 'No, I do not have a balcony in my house.', '不，我的房子沒有陽台。'),
  (gen_random_uuid(), 'poping', pp_house, 'Do you have a garage?', '你有車庫嗎？', 'Yes, I have a garage in my house.', '是的，我的房子有車庫。'),
  (gen_random_uuid(), 'poping', pp_house, 'What is your favourite room?', '你最喜歡的房間是哪個？', 'My favourite room is the living room because I can watch TV and talk with my family.', '我最喜歡的房間是客廳，因為我可以看電視和跟家人聊天。'),
  (gen_random_uuid(), 'poping', pp_house, 'What do you usually do in your bedroom?', '你通常在臥室做什麼？', 'I usually sleep, study, and use my phone in my bedroom.', '我通常在臥室睡覺、學習和用手機。'),
  (gen_random_uuid(), 'poping', pp_house, 'Can you describe your living room?', '描述一下你的客廳？', 'My living room is big and bright. There is a sofa, a TV, and a table.', '我的客廳又大又明亮。有一張沙發、一台電視和一張桌子。'),
  (gen_random_uuid(), 'poping', pp_house, 'Do you like your house? Why?', '你喜歡你的房子嗎？為什麼？', 'Yes, I like my house because it is clean and comfortable.', '是的，我喜歡我的房子，因為它乾淨又舒適。'),
  (gen_random_uuid(), 'poping', pp_house, 'Is your house near your workplace?', '你的房子離工作地點近嗎？', 'Yes, it is quite near, so it is very convenient. It takes ten minutes to drive.', '是的，很近，所以很方便。開車只需十分鐘。'),
  (gen_random_uuid(), 'poping', pp_house, 'What would you like to change about your house?', '你想改變房子的什麼？', 'I would like to have a bigger living room because it is small.', '我想要一個更大的客廳，因為現在的太小了。'),
  (gen_random_uuid(), 'poping', pp_house, 'Do you prefer living in a house or an apartment?', '你喜歡住房子還是公寓？', 'I prefer living in a house because it is quieter and more roomy.', '我喜歡住房子，因為比較安靜，空間也比較大。'),
  (gen_random_uuid(), 'poping', pp_house, 'What do you like doing at home?', '你在家喜歡做什麼？', 'I like cooking and spending time with my family.', '我喜歡煮飯和跟家人在一起。'),
  (gen_random_uuid(), 'poping', pp_house, 'Do you cook every day?', '你每天都煮飯嗎？', 'Yes, I cook every day. I enjoy preparing meals for my family. Cooking helps me relax.', '是的，我每天都煮飯。我喜歡為家人準備飯菜。煮飯幫助我放鬆。'),
  (gen_random_uuid(), 'poping', pp_house, 'Do you have neighbours?', '你有鄰居嗎？', 'Yes, I have very kind neighbours. They are friendly and sometimes we chat when we see each other.', '是的，我有很友善的鄰居。他們很友好，有時見面會聊天。'),
  (gen_random_uuid(), 'poping', pp_house, 'How often do you clean your house?', '你多久打掃一次房子？', 'I clean my house every day.', '我每天都打掃房子。'),
  (gen_random_uuid(), 'poping', pp_house, 'How many people live in your house?', '你的房子住幾個人？', 'Three people live in my house.', '我的房子住三個人。'),
  (gen_random_uuid(), 'poping', pp_house, 'Have you decorated your house?', '你有裝飾房子嗎？', 'Yes, I have decorated my house with flowers, pictures, and curtains.', '是的，我用花、圖畫和窗簾裝飾了房子。'),
  (gen_random_uuid(), 'poping', pp_house, 'Do you want to buy new furniture?', '你想買新傢具嗎？', 'Yes, I want to buy new furniture in the future.', '是的，我將來想買新傢具。'),
  (gen_random_uuid(), 'poping', pp_house, 'What kind of things do you have in your bedroom?', '你的臥室裡有什麼？', 'In my bedroom, I have a bed, a desk, a chair, and a wardrobe.', '我的臥室裡有一張床、一張書桌、一把椅子和一個衣櫃。');

  -- ----------------------------------------------------------
  -- CATEGORY: 太太 My Wife (poping ONLY)
  -- Source: My wife tab - extracted clean Q&A from essay + numbered items
  -- ----------------------------------------------------------
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'poping', pp_wife, 'What is your wife''s name?', '你太太叫什麼名字？', 'Her name is Jojo.', '她叫Jojo。'),
  (gen_random_uuid(), 'poping', pp_wife, 'How old is your wife?', '你太太幾歲？', 'She is fifty-five years old.', '她五十五歲。'),
  (gen_random_uuid(), 'poping', pp_wife, 'What does your wife do?', '你太太做什麼？', 'She is a housewife. She is very kind and friendly.', '她是家庭主婦。她很善良，也很友善。'),
  (gen_random_uuid(), 'poping', pp_wife, 'What does your wife like to do?', '你太太喜歡做什麼？', 'She likes cooking, watching movies, and going to the park. She is very caring and funny.', '她喜歡煮飯、看電影和去公園。她很體貼，也很風趣。'),
  (gen_random_uuid(), 'poping', pp_wife, 'How long have you been married?', '你們結婚多久了？', 'We have been married for thirty-five years.', '我們已經結婚三十五年了。'),
  (gen_random_uuid(), 'poping', pp_wife, 'How did you surprise your wife on her birthday?', '你怎樣給太太生日驚喜？', 'I surprised my wife with a cake and a small gift. We celebrated at home and had a happy day together.', '我給太太準備了蛋糕和小禮物。我們在家慶祝，度過了快樂的一天。'),
  (gen_random_uuid(), 'poping', pp_wife, 'Have you watched a movie recently?', '你最近有看電影嗎？', 'Yes, I watched a movie recently. It was very interesting. The name of the movie is Titanic.', '是的，我最近看了一部電影。很有趣。那部電影叫鐵達尼號。'),
  (gen_random_uuid(), 'poping', pp_wife, 'What do you like watching on TV?', '你喜歡看什麼電視？', 'I like watching TV with my wife. We usually watch movies and TV shows.', '我喜歡跟太太一起看電視。我們通常看電影和電視劇。'),
  (gen_random_uuid(), 'poping', pp_wife, 'What do you like doing in your free time?', '你空閒時間喜歡做什麼？', 'In my free time, I like walking, listening to music, and going to the park.', '空閒時間我喜歡散步、聽音樂和去公園。'),
  (gen_random_uuid(), 'poping', pp_wife, 'What is your favourite food?', '你最喜歡的食物是什麼？', 'My favourite food is sushi. I know how to cook sushi and I cook sometimes.', '我最喜歡的食物是壽司。我會做壽司，有時會煮。'),
  (gen_random_uuid(), 'poping', pp_wife, 'What do you like to eat on special occasions?', '特別日子你喜歡吃什麼？', 'On special occasions, I like sushi and seafood.', '特別日子我喜歡壽司和海鮮。'),
  (gen_random_uuid(), 'poping', pp_wife, 'Do you have children?', '你有小孩嗎？', 'I have one daughter. She is twenty-six years old. I spend a lot of time with my daughter and my wife.', '我有一個女兒。她二十六歲。我花很多時間跟女兒和太太在一起。'),
  (gen_random_uuid(), 'poping', pp_wife, 'Do you know your neighbours?', '你認識鄰居嗎？', 'Yes, I know my neighbours and I like my neighbourhood because it is quiet and convenient.', '是的，我認識鄰居，我喜歡我的社區因為很安靜又方便。'),
  (gen_random_uuid(), 'poping', pp_wife, 'Why do you like your house?', '你為什麼喜歡你的房子？', 'I like my house because it is comfortable and near many shops.', '我喜歡我的房子因為它很舒適，也靠近很多商店。'),
  (gen_random_uuid(), 'poping', pp_wife, 'How do you feel about your wife?', '你對太太有什麼感覺？', 'She is very important to me. I am very happy to have her in my life.', '她對我來說非常重要。有她在我生命中我非常開心。');

  -- ----------------------------------------------------------
  -- CATEGORY: 丈夫 My Husband (waikwan ONLY)
  -- Source: My husband tab (27 Q&A)
  -- ----------------------------------------------------------
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'waikwan', wk_husband, 'Do you have a husband?', '你有丈夫嗎？', 'Yes, I have a husband.', '是的，我有丈夫。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'What is his name?', '他叫什麼名字？', 'His name is Ben. He is still very active.', '他叫Ben。他仍然很活躍。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'How old is he?', '他幾歲？', 'He is fifty-six years old.', '他五十六歲。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'What does he do?', '他做什麼工作？', 'He is a warehouse operator. He is responsible for packing at the warehouse.', '他是倉庫操作員。他負責在倉庫包裝貨物。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'What does he look like?', '他長什麼樣？', 'He is tall and has short black hair.', '他很高，有一頭短黑髮。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'What is he like?', '他的性格怎樣？', 'He is kind and friendly.', '他很善良，也很友善。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'What does he like to do?', '他喜歡做什麼？', 'He likes watching TV and going to the park. He enjoys spending time outdoors.', '他喜歡看電視和去公園。他喜歡在戶外活動。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'What do you usually do together?', '你們通常一起做什麼？', 'We usually go to the park, go shopping, and eat dinner together.', '我們通常去公園、逛街和一起吃晚飯。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'Why do you like him?', '你為什麼喜歡他？', 'I like him because he is caring and helpful. He always takes care of me.', '我喜歡他因為他很體貼又樂於助人。他總是照顧我。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'How long have you been married?', '你們結婚多久了？', 'We have been married for thirty-five years and we are very happy together.', '我們已經結婚三十五年了，我們在一起很開心。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'Where did you meet your husband?', '你在哪裡認識丈夫的？', 'I met him through a friend.', '我透過朋友認識他的。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'When did you meet him?', '你什麼時候認識他的？', 'I met him thirty-eight years ago.', '我三十八年前認識他的。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'Does he help at home?', '他在家會幫忙嗎？', 'Yes, he helps me with housework.', '是的，他會幫我做家務。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'What is his favourite food?', '他最喜歡的食物是什麼？', 'His favourite food is chicken and ice cream.', '他最喜歡的食物是雞肉和雪糕。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'Does he like travelling?', '他喜歡旅遊嗎？', 'Yes, he likes travelling very much.', '是的，他很喜歡旅遊。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'Where do you usually go together?', '你們通常一起去哪裡？', 'We usually go to the park or the cinema.', '我們通常去公園或電影院。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'What makes him special?', '他有什麼特別的？', 'He is special because he always cares about me.', '他特別是因為他總是關心我。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'Do you have any plans for the future?', '你們有什麼未來計劃嗎？', 'Yes, we want to buy a car in the future.', '是的，我們將來想買一輛車。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'What do you like most about him?', '你最喜歡他什麼？', 'I like his personality the most.', '我最喜歡他的性格。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'Tell me about your daily routine.', '說說你的日常生活。', 'I wake up, clean my house, and watch TV in the evening.', '我起床，打掃房子，晚上看電視。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'Describe your family.', '描述一下你的家庭。', 'I have a small family. I live with my husband and daughter.', '我有一個小家庭。我和丈夫及女兒一起住。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'Where do you go on weekends?', '你週末去哪裡？', 'I usually go to the park and go shopping.', '我通常去公園和逛街。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'What is your favourite holiday?', '你最喜歡的假期是什麼？', 'My favourite holiday is Christmas.', '我最喜歡的假期是聖誕節。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'Do you prefer living in the city or the countryside?', '你喜歡住城市還是鄉村？', 'I prefer the city because it is more convenient and there are more shops.', '我喜歡城市，因為比較方便，商店也比較多。'),
  (gen_random_uuid(), 'waikwan', wk_husband, 'What are your future plans?', '你的未來計劃是什麼？', 'I want to travel more and have a happy life with my husband.', '我想多旅遊，和丈夫過幸福的生活。');

  -- ----------------------------------------------------------
  -- CATEGORY: 常見問題 Common Questions (shared - both profiles)
  -- Source: 閒談問題 + Part one 常見問題 + unnamed section (deduplicated, merged)
  -- ----------------------------------------------------------

  -- waikwan common questions
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'waikwan', wk_common, 'How long have you lived in the UK?', '你在英國住了多久？', 'I have lived here for four years.', '我在這裡住了四年。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What is the biggest difference between life in the UK and life in Hong Kong?', '英國和香港的生活最大的分別是什麼？', 'The weather is different, the language is different, and the people are different.', '天氣不同，語言不同，人也不同。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How long have you been learning English?', '你學英文多久了？', 'I have been learning English for six months.', '我學英文六個月了。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How do you learn English?', '你怎樣學英文？', 'I learn English from YouTube videos.', '我透過YouTube影片學英文。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Have you made any friends in the UK?', '你在英國有交到朋友嗎？', 'Yes, I have made friends in the UK.', '是的，我在英國交到了朋友。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Who is your best friend?', '你最好的朋友是誰？', 'My best friend is Angela, Tak, and Fung.', '我最好的朋友是Angela、Tak和Fung。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How often do you meet your friends?', '你多久見一次朋友？', 'I meet my friends every weekend.', '我每個週末都見朋友。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What activities do you enjoy doing with your friends?', '你喜歡和朋友做什麼活動？', 'I enjoy eating and chatting with my friends.', '我喜歡和朋友一起吃飯聊天。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Where do you like to travel with your friends?', '你喜歡和朋友去哪裡旅行？', 'I like to travel with my friends to London.', '我喜歡和朋友去倫敦旅行。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'When did you travel to your home country recently?', '你最近什麼時候回家鄉？', 'I went back to my home country last year.', '我去年回了家鄉。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Who did you travel with to your home country?', '你和誰一起回家鄉？', 'I travelled to my home country with my family.', '我和家人一起回家鄉。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What kind of things do you usually carry when you travel?', '你旅行通常帶什麼？', 'I carry clothes, money, documents, ATM cards, and medicine.', '我帶衣服、錢、文件、提款卡和藥物。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How long did you stay there?', '你在那裡待了多久？', 'I stayed there for three weeks.', '我在那裡待了三個星期。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How long was your journey?', '你的旅程有多長？', 'The journey was about thirteen hours.', '旅程大約十三個小時。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Are you planning to go there again soon?', '你計劃很快再去嗎？', 'I am planning to go there again next year.', '我計劃明年再去。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What do you like about your neighbourhood?', '你喜歡你社區的什麼？', 'I like the supermarkets and parks in my neighbourhood.', '我喜歡社區裡的超市和公園。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How far is the supermarket from where you live?', '超市離你家多遠？', 'It is about five minutes by car.', '開車大約五分鐘。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How often do you go to the supermarket?', '你多久去一次超市？', 'I go there every day.', '我每天都去。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What kind of things do you buy from there?', '你在那裡買什麼？', 'I buy fruits, meat, and soft drinks.', '我買水果、肉和汽水。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What do you watch on TV?', '你看什麼電視？', 'I watch Hong Kong dramas. I like watching a show called Come Home Love.', '我看香港劇集。我喜歡看一套叫《愛回家》的節目。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What time of the day do you watch TV?', '你一天中什麼時候看電視？', 'I watch TV in the evening around eight o''clock.', '我晚上大約八點看電視。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How long does one episode last?', '一集有多長？', 'One episode lasts about one hour.', '一集大約一小時。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Do you prefer to watch TV alone or with someone?', '你喜歡自己看電視還是跟人一起看？', 'I prefer watching TV with my family.', '我喜歡跟家人一起看電視。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What is your favourite special occasion?', '你最喜歡的特別日子是什麼？', 'My favourite special occasions are Christmas and Lunar New Year.', '我最喜歡的特別日子是聖誕節和農曆新年。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'When is your birthday?', '你的生日是什麼時候？', 'It is on the 28th of June.', '我的生日是六月二十八日。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How do you celebrate your birthday?', '你怎樣慶祝生日？', 'I celebrate with my family and friends. We have a meal together.', '我和家人朋友一起慶祝。我們一起吃飯。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Can you share a recent experience of celebrating a special occasion?', '你能分享最近慶祝特別日子的經驗嗎？', 'Recently, it was my best friend''s birthday, so we went out for Japanese food. We bought her a cake and a gift and she was very happy.', '最近是我好朋友的生日，我們一起去吃日本菜。我們買了蛋糕和禮物給她，她很開心。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'When is your wedding anniversary?', '你的結婚紀念日是什麼時候？', 'My wedding anniversary is on the 28th of May.', '我的結婚紀念日是五月二十八日。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How do you celebrate your wedding anniversary?', '你怎樣慶祝結婚紀念日？', 'I like making desserts for my husband, like pudding and cake. I also like to invite friends and family to our home.', '我喜歡做甜品給丈夫，例如布甸和蛋糕。我也喜歡邀請朋友和家人來家裡。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What is your favourite holiday in the UK?', '你在英國最喜歡的假期是什麼？', 'My favourite holiday in the UK is Christmas and New Year.', '我在英國最喜歡的假期是聖誕節和新年。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What is your favourite type of entertainment?', '你最喜歡的娛樂類型是什麼？', 'I like watching YouTube.', '我喜歡看YouTube。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What do you watch on YouTube?', '你在YouTube上看什麼？', 'I watch cooking videos.', '我看烹飪影片。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What do you like about living in the UK?', '你喜歡英國生活的什麼？', 'I like the weather and the people.', '我喜歡這裡的天氣和人。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Could you tell me about your favourite place in the UK?', '你能說說你在英國最喜歡的地方嗎？', 'Yes, I like the shopping centre. My favourite is Primark. It is about twenty minutes by car.', '是的，我喜歡購物中心。我最喜歡Primark。開車大約二十分鐘。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Do you know how to drive?', '你會開車嗎？', 'Yes, I know how to drive, but I do not drive very often.', '是的，我會開車，但我不常開。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What will you do after the exam?', '考試後你會做什麼？', 'After the exam, I will go home and relax.', '考試後，我會回家休息。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Do you know your neighbours?', '你認識鄰居嗎？', 'Yes, I know my neighbours. Sometimes we say hello and talk.', '是的，我認識鄰居。有時我們會打招呼聊天。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How much time do you spend with your daughter?', '你花多少時間和女兒在一起？', 'I spend a lot of time with my daughter, especially in the evening.', '我花很多時間和女兒在一起，特別是在晚上。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What are your favourite free time activities?', '你最喜歡的空閒活動是什麼？', 'My favourite free time activities are walking and going to the park.', '我最喜歡的空閒活動是散步和去公園。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How much free time do you have every day?', '你每天有多少空閒時間？', 'I have about one or two hours of free time every day.', '我每天大約有一到兩個小時的空閒時間。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Can you tell me about a film you have seen recently?', '你能說說最近看的一部電影嗎？', 'Yes, I watched a movie recently. It was very interesting. The name of the movie is Titanic. It is a very famous movie and I like it.', '是的，我最近看了一部電影。很有趣。電影的名字叫鐵達尼號。它是一部很有名的電影，我很喜歡。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How many years have you been married?', '你結婚幾年了？', 'I have been married for thirty-five years.', '我結婚三十五年了。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'When is your husband''s birthday?', '你丈夫的生日是什麼時候？', 'My husband''s birthday is on the 4th of August.', '我丈夫的生日是八月四日。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Have you ever surprised your husband for his birthday?', '你有給丈夫生日驚喜嗎？', 'Yes, I have. I made him a cake and gave him a small gift. We had dinner together and he was very happy.', '是的。我做了蛋糕給他，也送了小禮物。我們一起吃晚飯，他很開心。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What is your partner''s name?', '你伴侶叫什麼名字？', 'His name is Ben.', '他叫Ben。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What type of job does your partner have?', '你伴侶做什麼工作？', 'He is a warehouse operator. He is responsible for packaging the goods.', '他是倉庫操作員，負責包裝貨物。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What do you do together in your free time?', '你們空閒時間做什麼？', 'We usually watch movies, go for walks, and cook together.', '我們通常一起看電影、散步和做飯。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What family activities do you do?', '你們做什麼家庭活動？', 'We have family dinners and sometimes travel together.', '我們會一起吃家庭晚餐，有時也會一起去旅行。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Do you like going out with your family?', '你喜歡和家人一起出去嗎？', 'Yes, I enjoy going out with my family.', '是的，我很喜歡和家人一起出去。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Do your parents live with you?', '你的父母和你住在一起嗎？', 'No, my parents do not live with me.', '不，我的父母不和我住在一起。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What activities do your parents like?', '你父母喜歡做什麼？', 'They like gardening and watching TV.', '他們喜歡園藝和看電視。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How was the weather yesterday?', '昨天的天氣怎麼樣？', 'The weather yesterday was cool and cloudy.', '昨天的天氣涼爽多雲。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What do you do in the morning?', '你早上做什麼？', 'In the morning, I brush my teeth, eat breakfast, and go about my day.', '早上我刷牙、吃早餐，然後開始一天的生活。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Do you have any parks in your neighbourhood?', '你的社區有公園嗎？', 'Yes, there is one park. I go there every weekend with my family.', '是的，有一個公園。我每個週末都和家人去。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Have you ever travelled by public transport?', '你有搭過公共交通嗎？', 'Yes, I have. My favourite public transport is the bus.', '是的。我最喜歡的公共交通是巴士。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Can you share a recent experience of travelling by bus?', '你能分享最近搭巴士的經驗嗎？', 'It was good and convenient. I arrived on time.', '很好很方便。我準時到達了。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Do you think the bus is cheaper or the train?', '你覺得巴士便宜還是火車便宜？', 'The bus is cheaper because it costs less money.', '巴士比較便宜，因為花費比較少。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How is the weather in your area?', '你那裡的天氣怎樣？', 'It is sunny and warm.', '天氣晴朗又溫暖。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'What type of houses do you like?', '你喜歡哪種房子？', 'I like small houses.', '我喜歡小房子。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Who is your neighbour?', '你的鄰居是誰？', 'My neighbour is Grace.', '我的鄰居是Grace。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Do you speak to your neighbours?', '你會和鄰居說話嗎？', 'Yes, sometimes I speak to my neighbours.', '是的，有時我會和鄰居說話。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How did you celebrate your recent wedding anniversary?', '你最近怎樣慶祝結婚紀念日？', 'Recently, I celebrated my wedding anniversary. We went to a restaurant with my family.', '最近我慶祝了結婚紀念日。我們和家人一起去了餐廳。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'How do you go shopping?', '你怎樣去購物？', 'I go shopping by car.', '我開車去購物。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Who do you go shopping with?', '你和誰一起購物？', 'I go shopping with my family.', '我和家人一起購物。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'When do you go shopping?', '你什麼時候去購物？', 'I go shopping every Sunday.', '我每個星期日去購物。'),
  (gen_random_uuid(), 'waikwan', wk_common, 'Why do you like your favourite shopping centre?', '你為什麼喜歡你最喜歡的購物中心？', 'It is big and everything is available there. The prices are good.', '它很大，什麼都有。價錢也很好。');

  -- poping common questions
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'poping', pp_common, 'How long have you lived in the UK?', '你在英國住了多久？', 'I have lived here for four years.', '我在這裡住了四年。'),
  (gen_random_uuid(), 'poping', pp_common, 'What is the biggest difference between life in the UK and life in Hong Kong?', '英國和香港的生活最大的分別是什麼？', 'The weather is different, the language is different, and the people are different.', '天氣不同，語言不同，人也不同。'),
  (gen_random_uuid(), 'poping', pp_common, 'How long have you been learning English?', '你學英文多久了？', 'I have been learning English for six months.', '我學英文六個月了。'),
  (gen_random_uuid(), 'poping', pp_common, 'How do you learn English?', '你怎樣學英文？', 'I learn English from YouTube videos.', '我透過YouTube影片學英文。'),
  (gen_random_uuid(), 'poping', pp_common, 'Have you made any friends in the UK?', '你在英國有交到朋友嗎？', 'Yes, I have made friends in the UK.', '是的，我在英國交到了朋友。'),
  (gen_random_uuid(), 'poping', pp_common, 'Who is your best friend?', '你最好的朋友是誰？', 'My best friend is Angela, Tak, and Fung.', '我最好的朋友是Angela、Tak和Fung。'),
  (gen_random_uuid(), 'poping', pp_common, 'How often do you meet your friends?', '你多久見一次朋友？', 'I meet my friends every weekend.', '我每個週末都見朋友。'),
  (gen_random_uuid(), 'poping', pp_common, 'What activities do you enjoy doing with your friends?', '你喜歡和朋友做什麼活動？', 'I enjoy eating and chatting with my friends.', '我喜歡和朋友一起吃飯聊天。'),
  (gen_random_uuid(), 'poping', pp_common, 'Where do you like to travel with your friends?', '你喜歡和朋友去哪裡旅行？', 'I like to travel with my friends to London.', '我喜歡和朋友去倫敦旅行。'),
  (gen_random_uuid(), 'poping', pp_common, 'When did you travel to your home country recently?', '你最近什麼時候回家鄉？', 'I went back to my home country last year.', '我去年回了家鄉。'),
  (gen_random_uuid(), 'poping', pp_common, 'Who did you travel with to your home country?', '你和誰一起回家鄉？', 'I travelled to my home country with my family.', '我和家人一起回家鄉。'),
  (gen_random_uuid(), 'poping', pp_common, 'What kind of things do you usually carry when you travel?', '你旅行通常帶什麼？', 'I carry clothes, money, documents, ATM cards, and medicine.', '我帶衣服、錢、文件、提款卡和藥物。'),
  (gen_random_uuid(), 'poping', pp_common, 'How long did you stay there?', '你在那裡待了多久？', 'I stayed there for three weeks.', '我在那裡待了三個星期。'),
  (gen_random_uuid(), 'poping', pp_common, 'How long was your journey?', '你的旅程有多長？', 'The journey was about thirteen hours.', '旅程大約十三個小時。'),
  (gen_random_uuid(), 'poping', pp_common, 'Are you planning to go there again soon?', '你計劃很快再去嗎？', 'I am planning to go there again next year.', '我計劃明年再去。'),
  (gen_random_uuid(), 'poping', pp_common, 'What do you like about your neighbourhood?', '你喜歡你社區的什麼？', 'I like the supermarkets and parks in my neighbourhood.', '我喜歡社區裡的超市和公園。'),
  (gen_random_uuid(), 'poping', pp_common, 'How far is the supermarket from where you live?', '超市離你家多遠？', 'It is about five minutes by car.', '開車大約五分鐘。'),
  (gen_random_uuid(), 'poping', pp_common, 'How often do you go to the supermarket?', '你多久去一次超市？', 'I go there every day.', '我每天都去。'),
  (gen_random_uuid(), 'poping', pp_common, 'What kind of things do you buy from there?', '你在那裡買什麼？', 'I buy fruits, meat, and soft drinks.', '我買水果、肉和汽水。'),
  (gen_random_uuid(), 'poping', pp_common, 'What do you watch on TV?', '你看什麼電視？', 'I watch Hong Kong dramas. I like watching a show called Come Home Love.', '我看香港劇集。我喜歡看一套叫《愛回家》的節目。'),
  (gen_random_uuid(), 'poping', pp_common, 'What time of the day do you watch TV?', '你一天中什麼時候看電視？', 'I watch TV in the evening around eight o''clock.', '我晚上大約八點看電視。'),
  (gen_random_uuid(), 'poping', pp_common, 'How long does one episode last?', '一集有多長？', 'One episode lasts about one hour.', '一集大約一小時。'),
  (gen_random_uuid(), 'poping', pp_common, 'Do you prefer to watch TV alone or with someone?', '你喜歡自己看電視還是跟人一起看？', 'I prefer watching TV with my family.', '我喜歡跟家人一起看電視。'),
  (gen_random_uuid(), 'poping', pp_common, 'What is your favourite special occasion?', '你最喜歡的特別日子是什麼？', 'My favourite special occasions are Christmas and Lunar New Year.', '我最喜歡的特別日子是聖誕節和農曆新年。'),
  (gen_random_uuid(), 'poping', pp_common, 'When is your birthday?', '你的生日是什麼時候？', 'It is on the 28th of June.', '我的生日是六月二十八日。'),
  (gen_random_uuid(), 'poping', pp_common, 'How do you celebrate your birthday?', '你怎樣慶祝生日？', 'I celebrate with my family and friends. We have a meal together.', '我和家人朋友一起慶祝。我們一起吃飯。'),
  (gen_random_uuid(), 'poping', pp_common, 'Can you share a recent experience of celebrating a special occasion?', '你能分享最近慶祝特別日子的經驗嗎？', 'Recently, it was my best friend''s birthday, so we went out for Japanese food. We bought her a cake and a gift and she was very happy.', '最近是我好朋友的生日，我們一起去吃日本菜。我們買了蛋糕和禮物給她，她很開心。'),
  (gen_random_uuid(), 'poping', pp_common, 'When is your wedding anniversary?', '你的結婚紀念日是什麼時候？', 'My wedding anniversary is on the 28th of May.', '我的結婚紀念日是五月二十八日。'),
  (gen_random_uuid(), 'poping', pp_common, 'How do you celebrate your wedding anniversary?', '你怎樣慶祝結婚紀念日？', 'I celebrate at home with my family. We buy a cake and have a nice dinner together.', '我和家人在家慶祝。我們買蛋糕，一起吃一頓美味的晚餐。'),
  (gen_random_uuid(), 'poping', pp_common, 'What is your favourite holiday in the UK?', '你在英國最喜歡的假期是什麼？', 'My favourite holiday in the UK is Christmas and New Year.', '我在英國最喜歡的假期是聖誕節和新年。'),
  (gen_random_uuid(), 'poping', pp_common, 'What is your favourite type of entertainment?', '你最喜歡的娛樂類型是什麼？', 'I like watching YouTube.', '我喜歡看YouTube。'),
  (gen_random_uuid(), 'poping', pp_common, 'What do you watch on YouTube?', '你在YouTube上看什麼？', 'I watch cooking videos.', '我看烹飪影片。'),
  (gen_random_uuid(), 'poping', pp_common, 'What do you like about living in the UK?', '你喜歡英國生活的什麼？', 'I like the weather and the people.', '我喜歡這裡的天氣和人。'),
  (gen_random_uuid(), 'poping', pp_common, 'Could you tell me about your favourite place in the UK?', '你能說說你在英國最喜歡的地方嗎？', 'Yes, I like the shopping centre. My favourite is Primark. It is about twenty minutes by car.', '是的，我喜歡購物中心。我最喜歡Primark。開車大約二十分鐘。'),
  (gen_random_uuid(), 'poping', pp_common, 'Do you know how to drive?', '你會開車嗎？', 'Yes, I know how to drive, but I do not drive very often.', '是的，我會開車，但我不常開。'),
  (gen_random_uuid(), 'poping', pp_common, 'What will you do after the exam?', '考試後你會做什麼？', 'After the exam, I will go home and relax.', '考試後，我會回家休息。'),
  (gen_random_uuid(), 'poping', pp_common, 'Do you know your neighbours?', '你認識鄰居嗎？', 'Yes, I know my neighbours. Sometimes we say hello and talk.', '是的，我認識鄰居。有時我們會打招呼聊天。'),
  (gen_random_uuid(), 'poping', pp_common, 'How much time do you spend with your daughter?', '你花多少時間和女兒在一起？', 'I spend a lot of time with my daughter, especially in the evening.', '我花很多時間和女兒在一起，特別是在晚上。'),
  (gen_random_uuid(), 'poping', pp_common, 'What are your favourite free time activities?', '你最喜歡的空閒活動是什麼？', 'My favourite free time activities are walking and going to the park.', '我最喜歡的空閒活動是散步和去公園。'),
  (gen_random_uuid(), 'poping', pp_common, 'How much free time do you have every day?', '你每天有多少空閒時間？', 'I have about one or two hours of free time every day.', '我每天大約有一到兩個小時的空閒時間。'),
  (gen_random_uuid(), 'poping', pp_common, 'Can you tell me about a film you have seen recently?', '你能說說最近看的一部電影嗎？', 'Yes, I watched a movie recently. It was very interesting. The name of the movie is Titanic. It is a very famous movie and I like it.', '是的，我最近看了一部電影。很有趣。電影的名字叫鐵達尼號。它是一部很有名的電影，我很喜歡。'),
  (gen_random_uuid(), 'poping', pp_common, 'How many years have you been married?', '你結婚幾年了？', 'I have been married for thirty-five years.', '我結婚三十五年了。'),
  (gen_random_uuid(), 'poping', pp_common, 'When is your wife''s birthday?', '你太太的生日是什麼時候？', 'My wife''s birthday is on the 28th of June.', '我太太的生日是六月二十八日。'),
  (gen_random_uuid(), 'poping', pp_common, 'Have you ever surprised your wife for her birthday?', '你有給太太生日驚喜嗎？', 'Yes, I have. I bought her a small cake and some flowers. We had dinner together and she was very happy.', '是的。我買了一個小蛋糕和一些花給她。我們一起吃晚飯，她很開心。'),
  (gen_random_uuid(), 'poping', pp_common, 'What is your partner''s name?', '你伴侶叫什麼名字？', 'Her name is Jojo.', '她叫Jojo。'),
  (gen_random_uuid(), 'poping', pp_common, 'What type of job does your partner have?', '你伴侶做什麼工作？', 'She is a housewife.', '她是家庭主婦。'),
  (gen_random_uuid(), 'poping', pp_common, 'What do you do together in your free time?', '你們空閒時間做什麼？', 'We usually watch movies, go for walks, and cook together.', '我們通常一起看電影、散步和做飯。'),
  (gen_random_uuid(), 'poping', pp_common, 'What family activities do you do?', '你們做什麼家庭活動？', 'We have family dinners and sometimes travel together.', '我們會一起吃家庭晚餐，有時也會一起去旅行。'),
  (gen_random_uuid(), 'poping', pp_common, 'Do you like going out with your family?', '你喜歡和家人一起出去嗎？', 'Yes, I enjoy going out with my family.', '是的，我很喜歡和家人一起出去。'),
  (gen_random_uuid(), 'poping', pp_common, 'Do your parents live with you?', '你的父母和你住在一起嗎？', 'No, my parents do not live with me.', '不，我的父母不和我住在一起。'),
  (gen_random_uuid(), 'poping', pp_common, 'What activities do your parents like?', '你父母喜歡做什麼？', 'They like gardening and watching TV.', '他們喜歡園藝和看電視。'),
  (gen_random_uuid(), 'poping', pp_common, 'How was the weather yesterday?', '昨天的天氣怎麼樣？', 'The weather yesterday was cool and cloudy.', '昨天的天氣涼爽多雲。'),
  (gen_random_uuid(), 'poping', pp_common, 'What do you do in the morning?', '你早上做什麼？', 'In the morning, I brush my teeth, eat breakfast, and go about my day.', '早上我刷牙、吃早餐，然後開始一天的生活。'),
  (gen_random_uuid(), 'poping', pp_common, 'Do you have any parks in your neighbourhood?', '你的社區有公園嗎？', 'Yes, there is one park. I go there every weekend with my family.', '是的，有一個公園。我每個週末都和家人去。'),
  (gen_random_uuid(), 'poping', pp_common, 'Have you ever travelled by public transport?', '你有搭過公共交通嗎？', 'Yes, I have. My favourite public transport is the bus.', '是的。我最喜歡的公共交通是巴士。'),
  (gen_random_uuid(), 'poping', pp_common, 'Can you share a recent experience of travelling by bus?', '你能分享最近搭巴士的經驗嗎？', 'It was good and convenient. I arrived on time.', '很好很方便。我準時到達了。'),
  (gen_random_uuid(), 'poping', pp_common, 'Do you think the bus is cheaper or the train?', '你覺得巴士便宜還是火車便宜？', 'The bus is cheaper because it costs less money.', '巴士比較便宜，因為花費比較少。'),
  (gen_random_uuid(), 'poping', pp_common, 'How is the weather in your area?', '你那裡的天氣怎樣？', 'It is sunny and warm.', '天氣晴朗又溫暖。'),
  (gen_random_uuid(), 'poping', pp_common, 'What type of houses do you like?', '你喜歡哪種房子？', 'I like small houses.', '我喜歡小房子。'),
  (gen_random_uuid(), 'poping', pp_common, 'Who is your neighbour?', '你的鄰居是誰？', 'My neighbour is Grace.', '我的鄰居是Grace。'),
  (gen_random_uuid(), 'poping', pp_common, 'Do you speak to your neighbours?', '你會和鄰居說話嗎？', 'Yes, sometimes I speak to my neighbours.', '是的，有時我會和鄰居說話。'),
  (gen_random_uuid(), 'poping', pp_common, 'How did you celebrate your recent wedding anniversary?', '你最近怎樣慶祝結婚紀念日？', 'Recently, I celebrated my wedding anniversary. We went to a restaurant with my family.', '最近我慶祝了結婚紀念日。我們和家人一起去了餐廳。'),
  (gen_random_uuid(), 'poping', pp_common, 'How do you go shopping?', '你怎樣去購物？', 'I go shopping by car.', '我開車去購物。'),
  (gen_random_uuid(), 'poping', pp_common, 'Who do you go shopping with?', '你和誰一起購物？', 'I go shopping with my family.', '我和家人一起購物。'),
  (gen_random_uuid(), 'poping', pp_common, 'When do you go shopping?', '你什麼時候去購物？', 'I go shopping every Sunday.', '我每個星期日去購物。'),
  (gen_random_uuid(), 'poping', pp_common, 'Why do you like your favourite shopping centre?', '你為什麼喜歡你最喜歡的購物中心？', 'It is big and everything is available there. The prices are good.', '它很大，什麼都有。價錢也很好。');

  -- ----------------------------------------------------------
  -- CATEGORY: 考試 Examination (shared - both profiles)
  -- Source: examination tab
  -- ----------------------------------------------------------
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'waikwan', wk_exam, 'How did you come to the examination centre today?', '你今天怎樣來考試中心的？', 'I came by car. I drove here.', '我開車來的。'),
  (gen_random_uuid(), 'waikwan', wk_exam, 'Did you come alone or with someone?', '你是自己來還是跟別人一起來？', 'I came with my husband.', '我和丈夫一起來的。'),
  (gen_random_uuid(), 'waikwan', wk_exam, 'Do you have a driver''s licence?', '你有駕駛執照嗎？', 'Yes, I have a driver''s licence.', '是的，我有駕駛執照。'),
  (gen_random_uuid(), 'waikwan', wk_exam, 'What car do you have?', '你有什麼車？', 'I have a fuel car. It is a Toyota CHR.', '我有一輛燃油車。是Toyota CHR。'),
  (gen_random_uuid(), 'waikwan', wk_exam, 'What will you do after the exam?', '考試後你會做什麼？', 'I will go back home and relax.', '我會回家休息。'),
  (gen_random_uuid(), 'waikwan', wk_exam, 'What do you like about your neighbourhood?', '你喜歡你社區的什麼？', 'I like the shopping centre and the parks in my neighbourhood.', '我喜歡社區裡的購物中心和公園。'),
  (gen_random_uuid(), 'waikwan', wk_exam, 'What do you like about living in the UK?', '你喜歡英國生活的什麼？', 'I like the shopping centres in the UK.', '我喜歡英國的購物中心。'),
  (gen_random_uuid(), 'waikwan', wk_exam, 'How long did it take you to get here?', '你花了多久到這裡？', 'It took me about thirty to forty minutes to get here.', '我大約花了三十到四十分鐘到這裡。'),
  (gen_random_uuid(), 'waikwan', wk_exam, 'What were you doing on your way to the examination centre?', '你在來考試中心的路上做了什麼？', 'I was listening to music on the way.', '我在路上聽音樂。');

  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'poping', pp_exam, 'How did you come to the examination centre today?', '你今天怎樣來考試中心的？', 'I came by car. I drove here.', '我開車來的。'),
  (gen_random_uuid(), 'poping', pp_exam, 'Did you come alone or with someone?', '你是自己來還是跟別人一起來？', 'I came with my wife.', '我和太太一起來的。'),
  (gen_random_uuid(), 'poping', pp_exam, 'Do you have a driver''s licence?', '你有駕駛執照嗎？', 'Yes, I have a driver''s licence.', '是的，我有駕駛執照。'),
  (gen_random_uuid(), 'poping', pp_exam, 'What car do you have?', '你有什麼車？', 'I have a fuel car. It is a Toyota CHR.', '我有一輛燃油車。是Toyota CHR。'),
  (gen_random_uuid(), 'poping', pp_exam, 'What will you do after the exam?', '考試後你會做什麼？', 'I will go back home and relax.', '我會回家休息。'),
  (gen_random_uuid(), 'poping', pp_exam, 'What do you like about your neighbourhood?', '你喜歡你社區的什麼？', 'I like the shopping centre and the parks in my neighbourhood.', '我喜歡社區裡的購物中心和公園。'),
  (gen_random_uuid(), 'poping', pp_exam, 'What do you like about living in the UK?', '你喜歡英國生活的什麼？', 'I like the shopping centres in the UK.', '我喜歡英國的購物中心。'),
  (gen_random_uuid(), 'poping', pp_exam, 'How long did it take you to get here?', '你花了多久到這裡？', 'It took me about thirty to forty minutes to get here.', '我大約花了三十到四十分鐘到這裡。'),
  (gen_random_uuid(), 'poping', pp_exam, 'What were you doing on your way to the examination centre?', '你在來考試中心的路上做了什麼？', 'I was listening to music and chatting with my wife.', '我在路上聽音樂，也跟太太聊天。');

  -- ----------------------------------------------------------
  -- CATEGORY: 音樂 Music (shared - both profiles)
  -- Source: Music tab (15 Q&A) + Vocabulary section (11 Q&A)
  -- ----------------------------------------------------------
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'waikwan', wk_music, 'Do you like music?', '你喜歡音樂嗎？', 'Yes, I like music because it makes me happy.', '是的，我喜歡音樂，因為它讓我快樂。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'What type of music do you like?', '你喜歡什麼類型的音樂？', 'I like pop music because it is easy to listen to.', '我喜歡流行音樂，因為它容易聽。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'What kind of music do you like when you are happy?', '你心情開心的時候喜歡聽什麼音樂？', 'I like to listen to powerful, high-energy music when I feel happy.', '心情開心的時候，我喜歡聽節奏強勁、充滿活力的音樂。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'How do you usually listen to music?', '你通常用什麼方式聽音樂？', 'I usually listen to music on my phone because it is convenient.', '我通常用手機聽音樂，因為很方便。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'How often do you listen to music?', '你多久聽一次音樂？', 'I listen to music almost every day because I enjoy it.', '我幾乎每天都聽音樂，因為我喜歡。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Do you listen to music while driving?', '你開車時會聽音樂嗎？', 'Yes, it helps me relax because it reduces stress.', '是的，它能幫助我放鬆，因為它能減輕壓力。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Do you listen to music when exercising?', '你運動時會聽音樂嗎？', 'Yes, it gives me more energy.', '是的，它讓我更有活力。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Does music help you in any way?', '音樂對你有什麼幫助？', 'Yes, music helps me relax.', '是的，音樂幫助我放鬆。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Have you been to a concert?', '你去過演唱會嗎？', 'Yes, I went to a concert before. It was exciting.', '是的，我之前去過演唱會，很精彩。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Will you go to a concert this year?', '你今年會去演唱會嗎？', 'I hope so, because I enjoy live music.', '我希望如此，因為我喜歡現場音樂。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Does your country have traditional music?', '你的國家有傳統音樂嗎？', 'Yes, my country has traditional music and folk songs.', '是的，我的國家有傳統音樂和民謠。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Do you have songs for special occasions?', '你有適合特殊場合的歌曲嗎？', 'Yes, we have songs for birthdays and weddings.', '是的，我們有生日歌和婚禮歌曲。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Do you think music is good or bad?', '你認為音樂是好是壞？', 'I think music is good because it makes people happy.', '我認為音樂很好，因為它能讓人快樂。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Is there a specific song or type of music you really like?', '你有特別喜歡的歌曲或音樂類型嗎？', 'I really like happy and relaxing songs.', '我非常喜歡快樂輕鬆的歌曲。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Does anyone else you know like music?', '你認識的人還有誰喜歡音樂？', 'Yes, my friends and family like music too.', '是的，我的朋友和家人也都喜歡音樂。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Do you prefer to listen to music in the morning or evening?', '你喜歡早上還是晚上聽音樂？', 'I prefer to listen to music in the evening.', '我喜歡晚上聽音樂。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Who is your favourite singer?', '你最喜歡的歌手是誰？', 'My favourite singer is MC Cheung Tin Fu. He is a Hong Kong singer.', '我最喜歡的歌手是張天賦。他是一位香港歌手。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'What do you like about his music?', '你喜歡他的音樂什麼？', 'I like his music. He has a nice voice.', '我喜歡他的音樂。他的聲音很好聽。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'What is your favourite type of music?', '你最喜歡的音樂類型是什麼？', 'My favourite type of music is Cantopop because it is easy to listen to.', '我最喜歡的音樂類型是粵語流行曲，因為容易聽。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Do you play any musical instruments?', '你會演奏樂器嗎？', 'No, I do not play any musical instruments.', '不，我不會演奏樂器。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Do you like to sing?', '你喜歡唱歌嗎？', 'Yes, I like to sing.', '是的，我喜歡唱歌。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'What is your favourite song?', '你最喜歡的歌是什麼？', 'My favourite song is Good Time by MC Cheung Tin Fu.', '我最喜歡的歌是張天賦的《Good Time》。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'Do you prefer listening to music alone or with others?', '你喜歡自己聽音樂還是跟別人一起？', 'I prefer listening to music alone.', '我喜歡自己一個人聽音樂。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'What was the first concert you attended?', '你第一次參加的演唱會是什麼？', 'The first concert I attended was a Leslie Cheung concert.', '我第一次參加的演唱會是張國榮的演唱會。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'How was the concert experience?', '演唱會的體驗怎樣？', 'It was very nice. The atmosphere was great.', '非常好。氣氛很棒。'),
  (gen_random_uuid(), 'waikwan', wk_music, 'How does music make you feel?', '音樂讓你感覺怎樣？', 'Music makes me happy because it helps me relax.', '音樂讓我開心，因為它幫助我放鬆。');

  -- poping music cards (same)
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'poping', pp_music, 'Do you like music?', '你喜歡音樂嗎？', 'Yes, I like music because it makes me happy.', '是的，我喜歡音樂，因為它讓我快樂。'),
  (gen_random_uuid(), 'poping', pp_music, 'What type of music do you like?', '你喜歡什麼類型的音樂？', 'I like pop music because it is easy to listen to.', '我喜歡流行音樂，因為它容易聽。'),
  (gen_random_uuid(), 'poping', pp_music, 'What kind of music do you like when you are happy?', '你心情開心的時候喜歡聽什麼音樂？', 'I like to listen to powerful, high-energy music when I feel happy.', '心情開心的時候，我喜歡聽節奏強勁、充滿活力的音樂。'),
  (gen_random_uuid(), 'poping', pp_music, 'How do you usually listen to music?', '你通常用什麼方式聽音樂？', 'I usually listen to music on my phone because it is convenient.', '我通常用手機聽音樂，因為很方便。'),
  (gen_random_uuid(), 'poping', pp_music, 'How often do you listen to music?', '你多久聽一次音樂？', 'I listen to music almost every day because I enjoy it.', '我幾乎每天都聽音樂，因為我喜歡。'),
  (gen_random_uuid(), 'poping', pp_music, 'Do you listen to music while driving?', '你開車時會聽音樂嗎？', 'Yes, it helps me relax because it reduces stress.', '是的，它能幫助我放鬆，因為它能減輕壓力。'),
  (gen_random_uuid(), 'poping', pp_music, 'Do you listen to music when exercising?', '你運動時會聽音樂嗎？', 'Yes, it gives me more energy.', '是的，它讓我更有活力。'),
  (gen_random_uuid(), 'poping', pp_music, 'Does music help you in any way?', '音樂對你有什麼幫助？', 'Yes, music helps me relax.', '是的，音樂幫助我放鬆。'),
  (gen_random_uuid(), 'poping', pp_music, 'Have you been to a concert?', '你去過演唱會嗎？', 'Yes, I went to a concert before. It was exciting.', '是的，我之前去過演唱會，很精彩。'),
  (gen_random_uuid(), 'poping', pp_music, 'Will you go to a concert this year?', '你今年會去演唱會嗎？', 'I hope so, because I enjoy live music.', '我希望如此，因為我喜歡現場音樂。'),
  (gen_random_uuid(), 'poping', pp_music, 'Does your country have traditional music?', '你的國家有傳統音樂嗎？', 'Yes, my country has traditional music and folk songs.', '是的，我的國家有傳統音樂和民謠。'),
  (gen_random_uuid(), 'poping', pp_music, 'Do you have songs for special occasions?', '你有適合特殊場合的歌曲嗎？', 'Yes, we have songs for birthdays and weddings.', '是的，我們有生日歌和婚禮歌曲。'),
  (gen_random_uuid(), 'poping', pp_music, 'Do you think music is good or bad?', '你認為音樂是好是壞？', 'I think music is good because it makes people happy.', '我認為音樂很好，因為它能讓人快樂。'),
  (gen_random_uuid(), 'poping', pp_music, 'Is there a specific song or type of music you really like?', '你有特別喜歡的歌曲或音樂類型嗎？', 'I really like happy and relaxing songs.', '我非常喜歡快樂輕鬆的歌曲。'),
  (gen_random_uuid(), 'poping', pp_music, 'Does anyone else you know like music?', '你認識的人還有誰喜歡音樂？', 'Yes, my friends and family like music too.', '是的，我的朋友和家人也都喜歡音樂。'),
  (gen_random_uuid(), 'poping', pp_music, 'Do you prefer to listen to music in the morning or evening?', '你喜歡早上還是晚上聽音樂？', 'I prefer to listen to music in the evening.', '我喜歡晚上聽音樂。'),
  (gen_random_uuid(), 'poping', pp_music, 'Who is your favourite singer?', '你最喜歡的歌手是誰？', 'My favourite singer is MC Cheung Tin Fu. He is a Hong Kong singer.', '我最喜歡的歌手是張天賦。他是一位香港歌手。'),
  (gen_random_uuid(), 'poping', pp_music, 'What do you like about his music?', '你喜歡他的音樂什麼？', 'I like his music. He has a nice voice.', '我喜歡他的音樂。他的聲音很好聽。'),
  (gen_random_uuid(), 'poping', pp_music, 'What is your favourite type of music?', '你最喜歡的音樂類型是什麼？', 'My favourite type of music is Cantopop because it is easy to listen to.', '我最喜歡的音樂類型是粵語流行曲，因為容易聽。'),
  (gen_random_uuid(), 'poping', pp_music, 'Do you play any musical instruments?', '你會演奏樂器嗎？', 'No, I do not play any musical instruments.', '不，我不會演奏樂器。'),
  (gen_random_uuid(), 'poping', pp_music, 'Do you like to sing?', '你喜歡唱歌嗎？', 'Yes, I like to sing.', '是的，我喜歡唱歌。'),
  (gen_random_uuid(), 'poping', pp_music, 'What is your favourite song?', '你最喜歡的歌是什麼？', 'My favourite song is Good Time by MC Cheung Tin Fu.', '我最喜歡的歌是張天賦的《Good Time》。'),
  (gen_random_uuid(), 'poping', pp_music, 'Do you prefer listening to music alone or with others?', '你喜歡自己聽音樂還是跟別人一起？', 'I prefer listening to music alone.', '我喜歡自己一個人聽音樂。'),
  (gen_random_uuid(), 'poping', pp_music, 'What was the first concert you attended?', '你第一次參加的演唱會是什麼？', 'The first concert I attended was a Leslie Cheung concert.', '我第一次參加的演唱會是張國榮的演唱會。'),
  (gen_random_uuid(), 'poping', pp_music, 'How was the concert experience?', '演唱會的體驗怎樣？', 'It was very nice. The atmosphere was great.', '非常好。氣氛很棒。'),
  (gen_random_uuid(), 'poping', pp_music, 'How does music make you feel?', '音樂讓你感覺怎樣？', 'Music makes me happy because it helps me relax.', '音樂讓我開心，因為它幫助我放鬆。');

  -- ----------------------------------------------------------
  -- CATEGORY: 節日 Festival (shared - both profiles)
  -- Source: Festival tab (23 Q&A)
  -- ----------------------------------------------------------
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'waikwan', wk_festival, 'What is your favourite festival?', '你最喜歡的節日是什麼？', 'My favourite festival is Lunar New Year. It is fun.', '我最喜歡的節日是農曆新年，它很有趣。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'Why do you like it?', '為什麼喜歡它？', 'I like it because I can see my family and eat good food.', '我喜歡它，因為我可以見到家人，還能吃到美食。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'What do people do during this festival?', '人們在這個節日期間做什麼？', 'People visit relatives and have dinner together.', '人們會探親訪友，一起吃晚餐。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'Where do you celebrate it?', '你們在哪裡慶祝？', 'I celebrate it at home with my family.', '我在家和家人一起慶祝。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'Do you celebrate it every year?', '你們每年都慶祝嗎？', 'Yes, I celebrate it every year with my family.', '是的，我每年都和家人一起慶祝。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'Is this festival important to you?', '這個節日對你重要嗎？', 'Yes, it is important because my family gathers together.', '是的，這很重要，因為家人會聚在一起。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'What food do people eat?', '人們吃什麼食物？', 'People eat dumplings and fish at this festival.', '在這節日裡，人們會吃餃子和魚。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'Do children like this festival? Why?', '孩子們喜歡這個節日嗎？為什麼？', 'Yes, children like it because they get red packets.', '是的，孩子們喜歡，因為他們能收到紅包。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'How do you usually celebrate Chinese New Year?', '你們通常怎樣慶祝中國新年？', 'I usually celebrate it at home with my family and eat special food.', '我通常會和家人在家慶祝，吃特別的食物。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'Who do you celebrate with?', '你和誰一起慶祝？', 'I celebrate with my family.', '我和家人一起慶祝。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'Do you give or receive anything?', '你們有送禮或收禮嗎？', 'Yes, we give and receive red packets with my family.', '是的，我們家會互送紅包。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'What decorations do you use?', '你們用什麼裝飾？', 'We put up red lanterns and couplets.', '我們會掛起紅燈籠，也貼上對聯。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'Do you wear special clothes?', '你們會穿特別的衣服嗎？', 'Yes, I wear red clothes with my family.', '是的，我會和家人一起穿紅色衣服。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'Do you watch anything special on TV?', '你們看什麼特別的電視節目嗎？', 'We watch the Spring Festival Gala on TV with my family.', '我和家人一起觀看春節聯歡晚會。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'Do you go outside during the festival?', '節日期間會外出嗎？', 'Sometimes, we go to see fireworks with my family.', '有時候，我們會和家人一起看煙火。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'What is your favourite part of Chinese New Year?', '你最喜歡春節的哪個部分？', 'I like eating delicious food with my family.', '我喜歡和家人一起享用美食。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'Is Chinese New Year important in your country?', '中國新年在你的國家重要嗎？', 'Yes, it is very important because I celebrate with my family.', '是的，這非常重要，因為我和家人一起慶祝。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'Have you ever celebrated New Year in another country?', '你曾在其他國家慶祝過新年嗎？', 'Yes, I have been to mainland China to celebrate New Year.', '是的，我曾經去過中國大陸過新年。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'What kind of festivals do you celebrate in your country?', '你們國家慶祝什麼節日？', 'In Hong Kong, we celebrate Chinese New Year.', '在香港，我們慶祝農曆新年。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'What do you usually do to celebrate festivals?', '你通常怎樣慶祝節日？', 'We cook and have dinner together.', '我們一起煮飯，一起吃晚餐。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'What is the most important festival in your country?', '你國家最重要的節日是什麼？', 'The most important festival is Chinese New Year.', '最重要的節日是中國新年。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'How do people prepare for festivals?', '人們怎樣為節日做準備？', 'People clean their homes and buy food.', '人們會打掃房子並購買食物。'),
  (gen_random_uuid(), 'waikwan', wk_festival, 'Do you have childhood memories of celebrating festivals?', '你小時候有慶祝節日的回憶嗎？', 'Yes, I remember getting red packets and eating with my family.', '是的，我記得收到紅包和跟家人一起吃飯。');

  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'poping', pp_festival, 'What is your favourite festival?', '你最喜歡的節日是什麼？', 'My favourite festival is Lunar New Year. It is fun.', '我最喜歡的節日是農曆新年，它很有趣。'),
  (gen_random_uuid(), 'poping', pp_festival, 'Why do you like it?', '為什麼喜歡它？', 'I like it because I can see my family and eat good food.', '我喜歡它，因為我可以見到家人，還能吃到美食。'),
  (gen_random_uuid(), 'poping', pp_festival, 'What do people do during this festival?', '人們在這個節日期間做什麼？', 'People visit relatives and have dinner together.', '人們會探親訪友，一起吃晚餐。'),
  (gen_random_uuid(), 'poping', pp_festival, 'Where do you celebrate it?', '你們在哪裡慶祝？', 'I celebrate it at home with my family.', '我在家和家人一起慶祝。'),
  (gen_random_uuid(), 'poping', pp_festival, 'Do you celebrate it every year?', '你們每年都慶祝嗎？', 'Yes, I celebrate it every year with my family.', '是的，我每年都和家人一起慶祝。'),
  (gen_random_uuid(), 'poping', pp_festival, 'Is this festival important to you?', '這個節日對你重要嗎？', 'Yes, it is important because my family gathers together.', '是的，這很重要，因為家人會聚在一起。'),
  (gen_random_uuid(), 'poping', pp_festival, 'What food do people eat?', '人們吃什麼食物？', 'People eat dumplings and fish at this festival.', '在這節日裡，人們會吃餃子和魚。'),
  (gen_random_uuid(), 'poping', pp_festival, 'Do children like this festival? Why?', '孩子們喜歡這個節日嗎？為什麼？', 'Yes, children like it because they get red packets.', '是的，孩子們喜歡，因為他們能收到紅包。'),
  (gen_random_uuid(), 'poping', pp_festival, 'How do you usually celebrate Chinese New Year?', '你們通常怎樣慶祝中國新年？', 'I usually celebrate it at home with my family and eat special food.', '我通常會和家人在家慶祝，吃特別的食物。'),
  (gen_random_uuid(), 'poping', pp_festival, 'Who do you celebrate with?', '你和誰一起慶祝？', 'I celebrate with my family.', '我和家人一起慶祝。'),
  (gen_random_uuid(), 'poping', pp_festival, 'Do you give or receive anything?', '你們有送禮或收禮嗎？', 'Yes, we give and receive red packets with my family.', '是的，我們家會互送紅包。'),
  (gen_random_uuid(), 'poping', pp_festival, 'What decorations do you use?', '你們用什麼裝飾？', 'We put up red lanterns and couplets.', '我們會掛起紅燈籠，也貼上對聯。'),
  (gen_random_uuid(), 'poping', pp_festival, 'Do you wear special clothes?', '你們會穿特別的衣服嗎？', 'Yes, I wear red clothes with my family.', '是的，我會和家人一起穿紅色衣服。'),
  (gen_random_uuid(), 'poping', pp_festival, 'Do you watch anything special on TV?', '你們看什麼特別的電視節目嗎？', 'We watch the Spring Festival Gala on TV with my family.', '我和家人一起觀看春節聯歡晚會。'),
  (gen_random_uuid(), 'poping', pp_festival, 'Do you go outside during the festival?', '節日期間會外出嗎？', 'Sometimes, we go to see fireworks with my family.', '有時候，我們會和家人一起看煙火。'),
  (gen_random_uuid(), 'poping', pp_festival, 'What is your favourite part of Chinese New Year?', '你最喜歡春節的哪個部分？', 'I like eating delicious food with my family.', '我喜歡和家人一起享用美食。'),
  (gen_random_uuid(), 'poping', pp_festival, 'Is Chinese New Year important in your country?', '中國新年在你的國家重要嗎？', 'Yes, it is very important because I celebrate with my family.', '是的，這非常重要，因為我和家人一起慶祝。'),
  (gen_random_uuid(), 'poping', pp_festival, 'Have you ever celebrated New Year in another country?', '你曾在其他國家慶祝過新年嗎？', 'Yes, I have been to mainland China to celebrate New Year.', '是的，我曾經去過中國大陸過新年。'),
  (gen_random_uuid(), 'poping', pp_festival, 'What kind of festivals do you celebrate in your country?', '你們國家慶祝什麼節日？', 'In Hong Kong, we celebrate Chinese New Year.', '在香港，我們慶祝農曆新年。'),
  (gen_random_uuid(), 'poping', pp_festival, 'What do you usually do to celebrate festivals?', '你通常怎樣慶祝節日？', 'We cook and have dinner together.', '我們一起煮飯，一起吃晚餐。'),
  (gen_random_uuid(), 'poping', pp_festival, 'What is the most important festival in your country?', '你國家最重要的節日是什麼？', 'The most important festival is Chinese New Year.', '最重要的節日是中國新年。'),
  (gen_random_uuid(), 'poping', pp_festival, 'How do people prepare for festivals?', '人們怎樣為節日做準備？', 'People clean their homes and buy food.', '人們會打掃房子並購買食物。'),
  (gen_random_uuid(), 'poping', pp_festival, 'Do you have childhood memories of celebrating festivals?', '你小時候有慶祝節日的回憶嗎？', 'Yes, I remember getting red packets and eating with my family.', '是的，我記得收到紅包和跟家人一起吃飯。');

  -- ----------------------------------------------------------
  -- CATEGORY: 空閒活動 Free Time (shared - both profiles)
  -- Source: My free time activities + Tab 18 Free time activities (merged, deduplicated)
  -- ----------------------------------------------------------
  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'waikwan', wk_freetime, 'What are your free time activities?', '你的空閒活動是什麼？', 'I like going to the park in my free time.', '我空閒時間喜歡去公園。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'Where is your favourite park?', '你最喜歡的公園在哪裡？', 'My favourite park is near my house in Bristol.', '我最喜歡的公園在布里斯托，就在我家附近。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'Is it a big park or a small park?', '它是大公園還是小公園？', 'It is a small park.', '它是一個小公園。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'What do you do in the park?', '你在公園做什麼？', 'I like to walk in the park.', '我喜歡在公園散步。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'When did you last go to the park?', '你上次什麼時候去公園？', 'I went to the park recently. I walked in the park.', '我最近去了公園。我在公園散步。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'When are you planning to go to the park again?', '你計劃什麼時候再去公園？', 'I will go to the park again next week.', '我下週會再去公園。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'How do you get to the park?', '你怎樣去公園？', 'It is very near, so I walk to the park.', '很近，所以我走路去公園。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'What do you like about the park?', '你喜歡公園的什麼？', 'I like the trees, flowers, and fresh air.', '我喜歡公園的樹木、花朵和新鮮的空氣。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'What do you usually do in your free time?', '你通常在空閒時間做什麼？', 'I usually watch videos and use my phone to watch YouTube.', '我通常看影片，用手機看YouTube。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'How often do you do this activity?', '你多久做一次這個活動？', 'I do this almost every day.', '我幾乎每天都會做。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'Who do you usually do it with?', '你通常跟誰一起做？', 'Sometimes I do it alone, and sometimes with my family.', '有時我自己做，有時和家人一起做。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'Where do you usually do this activity?', '你通常在哪裡做？', 'I usually do it at home because it is very relaxing.', '我通常在家裡做，因為很放鬆。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'Why do you like this activity?', '你為什麼喜歡這個活動？', 'I like it because it helps me relax and learn new things.', '我喜歡它，因為它可以讓我放鬆，也能學新東西。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'What did you do last weekend in your free time?', '你上週末空閒時間做了什麼？', 'Last weekend, I went out shopping and watched TV at home.', '上週末，我去逛街和在家看電視。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'Do you prefer staying at home or going out?', '你比較喜歡待在家還是外出？', 'I prefer staying at home because it is quiet and comfortable.', '我比較喜歡待在家，因為安靜又舒適。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'What is a new hobby you would like to try?', '你將來想嘗試什麼新嗜好？', 'I would like to try learning how to cook new dishes.', '我想嘗試學做新菜式。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'How does your free time help you relax?', '你的空閒時間怎樣幫助你放鬆？', 'My free time helps me forget my stress and feel happy.', '我的空閒時間幫助我忘記壓力，感覺更開心。'),
  (gen_random_uuid(), 'waikwan', wk_freetime, 'Is free time important for you?', '空閒時間對你重要嗎？', 'Yes, free time is important for me because I need to rest and enjoy life.', '是的，空閒時間很重要，因為我需要休息和享受生活。');

  INSERT INTO cards (id, profile, category_id, question_en, question_zh, answer_en, answer_zh) VALUES
  (gen_random_uuid(), 'poping', pp_freetime, 'What are your free time activities?', '你的空閒活動是什麼？', 'I like going to the park in my free time.', '我空閒時間喜歡去公園。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'Where is your favourite park?', '你最喜歡的公園在哪裡？', 'My favourite park is near my house in Bristol.', '我最喜歡的公園在布里斯托，就在我家附近。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'Is it a big park or a small park?', '它是大公園還是小公園？', 'It is a small park.', '它是一個小公園。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'What do you do in the park?', '你在公園做什麼？', 'I like to walk in the park.', '我喜歡在公園散步。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'When did you last go to the park?', '你上次什麼時候去公園？', 'I went to the park recently. I walked in the park.', '我最近去了公園。我在公園散步。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'When are you planning to go to the park again?', '你計劃什麼時候再去公園？', 'I will go to the park again next week.', '我下週會再去公園。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'How do you get to the park?', '你怎樣去公園？', 'It is very near, so I walk to the park.', '很近，所以我走路去公園。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'What do you like about the park?', '你喜歡公園的什麼？', 'I like the trees, flowers, and fresh air.', '我喜歡公園的樹木、花朵和新鮮的空氣。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'What do you usually do in your free time?', '你通常在空閒時間做什麼？', 'I usually watch videos and use my phone to watch YouTube.', '我通常看影片，用手機看YouTube。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'How often do you do this activity?', '你多久做一次這個活動？', 'I do this almost every day.', '我幾乎每天都會做。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'Who do you usually do it with?', '你通常跟誰一起做？', 'Sometimes I do it alone, and sometimes with my family.', '有時我自己做，有時和家人一起做。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'Where do you usually do this activity?', '你通常在哪裡做？', 'I usually do it at home because it is very relaxing.', '我通常在家裡做，因為很放鬆。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'Why do you like this activity?', '你為什麼喜歡這個活動？', 'I like it because it helps me relax and learn new things.', '我喜歡它，因為它可以讓我放鬆，也能學新東西。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'What did you do last weekend in your free time?', '你上週末空閒時間做了什麼？', 'Last weekend, I went out shopping and watched TV at home.', '上週末，我去逛街和在家看電視。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'Do you prefer staying at home or going out?', '你比較喜歡待在家還是外出？', 'I prefer staying at home because it is quiet and comfortable.', '我比較喜歡待在家，因為安靜又舒適。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'What is a new hobby you would like to try?', '你將來想嘗試什麼新嗜好？', 'I would like to try learning how to cook new dishes.', '我想嘗試學做新菜式。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'How does your free time help you relax?', '你的空閒時間怎樣幫助你放鬆？', 'My free time helps me forget my stress and feel happy.', '我的空閒時間幫助我忘記壓力，感覺更開心。'),
  (gen_random_uuid(), 'poping', pp_freetime, 'Is free time important for you?', '空閒時間對你重要嗎？', 'Yes, free time is important for me because I need to rest and enjoy life.', '是的，空閒時間很重要，因為我需要休息和享受生活。');

END $$;
