import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'dart:convert';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Chatbot Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: ChatbotPage(),
    );
  }
}

class ChatbotPage extends StatefulWidget {
  ChatbotPage({Key? key}) : super(key: key);

  @override
  _ChatbotPageState createState() => _ChatbotPageState();
}

class _ChatbotPageState extends State<ChatbotPage> {
  final TextEditingController _textController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [];

  Future<void> _sendUserInput(String userInput) async {
    String apiUrl = "http://api.choiminho.co.kr/gpt";

    Map<String, dynamic> body = {
      "user_content": userInput
    };

    Dio dio = Dio();
    Response response = await dio.post(apiUrl, data: body);

    if (response.statusCode == 200) {
      var jsonResponse = json.decode(response.data);
      String botResponse = jsonResponse['response'];

      setState(() {
        _messages.add({"role": "user", "content": userInput});
        _messages.add({"role": "bot", "content": botResponse});
      });
    } else {
      print("Request failed with status: ${response.statusCode}");
    }
  }

  Widget _buildMessageItem(Map<String, dynamic> message) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 10.0),
      child: Align(
        alignment: message["role"] == "user" ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 5.0),
          decoration: BoxDecoration(
            color: message["role"] == "user" ? Colors.lightBlueAccent : Colors.grey[400],
            borderRadius: BorderRadius.circular(20.0),
          ),
          child: Text(
            message["content"],
            style: TextStyle(
              color: Colors.white,
              fontSize: 16.0,
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Flutter Chatbot Demo"),
      ),
      body: Container(
        padding: EdgeInsets.all(10.0),
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  return _buildMessageItem(_messages[index]);
                },
              ),
            ),
            SizedBox(height: 10.0),
            TextField(
              controller: _textController,
              decoration: InputDecoration(
                hintText: "Type a message...",
                suffixIcon: IconButton(
                  onPressed: () {
                    _sendUserInput(_textController.text);
                    _textController.clear();
                  },
                  icon: Icon(Icons.send),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
