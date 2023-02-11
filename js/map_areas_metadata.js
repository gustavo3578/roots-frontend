

let area_transfer_points = {
    'ancient_forest_area1': {
        0: [2, 420, 'arrow_left', 'ancient_forest_village'],
        1: [584, 350, 'arrow_right', 'open_fields'],
    },
    'ancient_forest_village': {
        0: [584, 420, 'arrow_right', 'ancient_forest_area1'],
        1: [2, 170, 'arrow_left', 'ancient_forest_area2'],
        2: [2, 620, 'arrow_left', 'ancient_forest_area3'],
    },
    'ancient_forest_area2': {
        0: [584,  540, 'arrow_right', 'ancient_forest_village'],
        // TODO 1: [2, 170, 'arrow_left', 'ancient_forest_elder_cave'],
        2: [214, 720, 'arrow_down', 'ancient_forest_area3'],
    },
    'ancient_forest_area3': {
        0: [584,  170, 'arrow_right', 'ancient_forest_village'],
        // TODO 1: [2, 170, 'arrow_left', 'ancient_forest_elder_cave'],
        2: [214, 16, 'arrow_up', 'ancient_forest_area2'],
    },
}
