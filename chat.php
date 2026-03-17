<?php
header('Content-Type: application/json');
$file = 'messages.json';

if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['user']) && isset($input['message'])) {
        $messages = json_decode(file_get_contents($file), true);
        
        $messages[] = [
            'user' => htmlspecialchars($input['user']),
            'message' => htmlspecialchars($input['message'])
        ];
        
        if (count($messages) > 50) {
            array_shift($messages);
        }
        
        file_put_contents($file, json_encode($messages));
        echo json_encode(['status' => 'success']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo file_get_contents($file);
    exit;
}
?>