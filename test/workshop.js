const { init, workshop } = require('../index.js');

(async () => {
    const client = init(3167020)

    // const item = await client.workshop.getItem(3600356597n, {
    //     returnChildren: true,
    //     includeLongDescription: true,
    // })
    // console.log(item)

    // const items = await client.workshop.getAllItems(1,
    //     1, //workshop.UGCQueryType.RankedByPublicationDate,
    //     0, //workshop.UGCType.Items,
    //     3167020,
    //     3167020,
    //     {
    //         returnChildren: true,
    //         includeLongDescription: true,
    //     }
    // )
    // console.log(items)

    // === MULTILINGUAL SUPPORT TEST CASES ===
    // Note: These are example test cases. To actually test with Steam, you need:
    // 1. A valid Steam client connection
    // 2. A valid published file ID that you own
    // 3. The Steam app initialized with your game's app ID

    // Test Case 1: Backward compatibility - update without language parameter
    // This should work as before, defaulting to English
    // const result1 = await client.workshop.updateItem(
    //     3636544561, // Replace with actual PublishedFileId
    //     {
    //         title: "My Mod Title",
    //         description: "Default English description"
    //     }
    // );
    // console.log("Test 1 - Backward compatibility:", result1);

    // Test Case 2: Single-language update with language parameter
    // Explicitly set English content
    // const result2 = await client.workshop.updateItem(
    //     3636544561n,
    //     {
    //         title: "My Mod",
    //         description: "English description",
    //         language: "schinese" // Change to desired language code
    //     }
    // );
    // console.log("Test 2 - Single language (English):", result2);

    // Test Case 3: Multiple languages via multiple calls
    // Update content for different languages in separate calls
    /*
    // Update Chinese content
    const result3a = await client.workshop.updateItem(
        YOUR_ITEM_ID,
        {
            title: "我的模组",
            description: "中文描述",
            language: "schinese"
        }
    );
    console.log("Test 3a - Chinese:", result3a);

    // Update French content
    const result3b = await client.workshop.updateItem(
        YOUR_ITEM_ID,
        {
            title: "Mon Mod",
            description: "Description française",
            language: "french"
        }
    );
    console.log("Test 3b - French:", result3b);

    // Update German content
    const result3c = await client.workshop.updateItem(
        YOUR_ITEM_ID,
        {
            title: "Mein Mod",
            description: "Deutsche Beschreibung",
            language: "german"
        }
    );
    console.log("Test 3c - German:", result3c);
    */

    // Test Case 4: Parallel updates for multiple languages
    // You can also use Promise.all() to update multiple languages in parallel
    /*
    const results = await Promise.all([
        client.workshop.updateItem(YOUR_ITEM_ID, {
            title: "My Mod (Spanish)",
            description: "Descripción en español",
            language: "spanish"
        }),
        client.workshop.updateItem(YOUR_ITEM_ID, {
            title: "私のMod (Japanese)",
            description: "日本語の説明",
            language: "japanese"
        }),
        client.workshop.updateItem(YOUR_ITEM_ID, {
            title: "내 모드 (Korean)",
            description: "한국어 설명",
            language: "korean"
        })
    ]);
    console.log("Test 4 - Parallel updates:", results);
    */

    // Supported Steam language codes include:
    // english, schinese, tchinese, german, french, italian, korean, spanish, russian,
    // thai, japanese, portuguese, polish, danish, dutch, finnish, norwegian, swedish,
    // hungarian, czech, romanian, turkish, brazilian, bulgarian, greek, etc.
})()
