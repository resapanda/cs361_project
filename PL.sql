DROP PROCEDURE IF EXISTS sp_create_profile;
DELIMITER //
CREATE PROCEDURE sp_create_profile(																	-- label inputs and outputs 
	IN name_input VARCHAR(50),
	IN gender_input VARCHAR(10),
	IN age_input INT(11),
	IN breed_input VARCHAR(100),
    IN weight_input DECIMAL(5,2),
    IN photo_input VARCHAR(255),
	OUT new_profile_id INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Profile not added.' AS Result;
	END;

	START TRANSACTION;
	INSERT INTO Profiles (name, gender, age, breed, weight, photo_url)                                  -- inserts entry into Customers
	VALUES (
		name_input,
		gender_input,
		age_input,
		breed_input,
        weight_input,
        photo_input
	);
	SET new_profile_id = LAST_INSERT_ID();																-- set customer ID for output
	COMMIT;

END //
DELIMITER ;
