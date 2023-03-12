import 'package:flutter/material.dart';
import 'package:ai_comics/main_page/component/kakao_login.dart';
import 'package:ai_comics/main_page/component/main_view_model.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:ai_comics/main_page/component/swipe_image.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI-comics',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'AI-comics'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final viewModel = MainViewModel(KakaoLogin());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // body 내부에 겹치게 배치를 위해서 Stack
      body: Stack(
        children: [
          Container(child: HomeScreen()),
          // 화면 상단 타이틀
          Container(
            color: Colors.black.withOpacity(0.5),
            width: MediaQuery.of(context).size.width,
            height: 80,
              child: Align(
                alignment: Alignment.bottomLeft,
                  child: Padding(
                  padding: EdgeInsets.only(left: 5.0), // 아래에서 5, 왼쪽에서 2 띄움
                  child: Text(
                      widget.title,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                      fontSize: 20.0,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    )
                  ),
                ),
            ),
          ),

          // 로그인 바를 겹치면서 화면 아래쪽 에 배치를 위한 Positioned
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
              child: Container(
                color: Colors.black.withOpacity(0.5),
                height: 120,
                  alignment: Alignment.bottomCenter, // 화면 하단 중앙에 배치
                    child: Center(
                      child: StreamBuilder<User?>(
                        stream: FirebaseAuth.instance.authStateChanges(),
                        builder: (context, snapshot) {
                          //만약 로그아웃 상태라면 로그인 버튼을 보여줌
                          if (!snapshot.hasData) {
                            return ElevatedButton(
                              onPressed: () async {
                                await viewModel.login();
                                setState(() {});
                              },
                              style: ElevatedButton.styleFrom(
                                padding: EdgeInsets.zero,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(0),
                                ),
                                primary: Colors.transparent,
                                shadowColor: Colors.transparent,
                              ),
                              child: Image.asset('assets/images/button/kakao_login_medium_narrow.png'),
                            );
                          }
                          return Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  // 하단 왼쪽 버튼
                                  Padding(
                                    padding: EdgeInsets.only(right: 20),
                                    child: Column(
                                      children: [
                                        Container(
                                          width: 100,
                                          child: ElevatedButton(
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: Colors.transparent,
                                              shape: RoundedRectangleBorder(
                                                borderRadius: BorderRadius.circular(5.0), // 버튼 R값
                                                side: BorderSide(color: Colors.white),
                                              ),
                                            ),
                                            onPressed: () {
                                              // 버튼을 클릭할 때 실행되는 코드를 여기에 작성합니다.
                                            },
                                            child: Text('사진변환'),
                                          ),
                                        ),
                                        Container(
                                          width: 100,
                                          child: ElevatedButton(
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: Colors.transparent,
                                              shape: RoundedRectangleBorder(
                                                borderRadius: BorderRadius.circular(5.0), // 버튼 R값
                                                side: BorderSide(color: Colors.white),
                                              ),
                                            ),
                                            onPressed: () {
                                              // 버튼을 클릭할 때 실행되는 코드를 여기에 작성합니다.
                                            },
                                            child: Text('만화제작'),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  // 하단 중앙 프로필
                                  Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Container(
                                        width: 70,
                                        height: 70,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: Colors.yellow[300],
                                        ),
                                        child: ClipRRect(
                                          borderRadius: BorderRadius.circular(50),
                                          child: Image.network(
                                            viewModel.user?.kakaoAccount?.profile?.profileImageUrl ?? '',
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                      ),
                                      Text(
                                        '${viewModel.user?.kakaoAccount?.profile?.nickname ?? 'Unknown'}',
                                        style: TextStyle(color: Colors.white, fontSize: 20),
                                      ),
                                    ],
                                  ),

                                  // 하단 우측 버튼
                                  Padding(
                                    padding: EdgeInsets.only(left: 20),
                                    child: Column(
                                      children: [
                                        Container(
                                          width: 100,
                                          child: ElevatedButton(
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: Colors.transparent,
                                              shape: RoundedRectangleBorder(
                                                borderRadius: BorderRadius.circular(5.0), // 버튼 R값
                                                side: BorderSide(color: Colors.white),
                                              ),
                                            ),
                                            onPressed: () {
                                              // 버튼을 클릭할 때 실행되는 코드를 여기에 작성합니다.
                                            },
                                            child: Text('만화감상'),
                                          ),
                                        ),
                                        Container(
                                          width: 100,
                                          child: ElevatedButton(
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: Colors.transparent,
                                              shape: RoundedRectangleBorder(
                                                borderRadius: BorderRadius.circular(5.0), // 버튼 R값
                                                side: BorderSide(color: Colors.white),
                                              ),
                                            ),
                                            onPressed: () async {
                                              await viewModel.logout();
                                              setState(() {});
                                            },
                                            child: Text('로그아웃'),
                                          ),
                                        ),
                                      ],
                                    ),
                                ),
                          ],
                        ),
                      ],
                    );
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
