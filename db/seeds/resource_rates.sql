INSERT INTO resource_rates (resource_id, owner_id, rating) VALUES (9,5,4), (2,5,3), (7,4,3.5), (12,1,1);

SELECT title, AVG(resource_rates.rating) AS rating, ARRAY_AGG(comment) AS comments
FROM resources
LEFT JOIN resource_rates ON resources.id = resource_rates.resource_id
LEFT JOIN resource_comments ON  resources.id = resource_comments.resource_id
WHERE resources.id = 1
GROUP BY title;


