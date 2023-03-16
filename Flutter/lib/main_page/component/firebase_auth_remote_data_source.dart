import 'package:http/http.dart' as http;

class FirebaseAuthRemoteDataSource {
  final String url = 'https://us-central1-ai-comics-7ce98.cloudfunctions.net/createCustomToken';

  Future<String> createCustomToken(Map<String, dynamic> user) async {
    // 로딩 표시 시작
    // 예외처리를 위한 try-catch 블록 추가
    try {
      final customTokenResponse = await http.post(Uri.parse(url), body: user);

      if (customTokenResponse.statusCode == 200) {
        // 로딩 표시 종료
        return customTokenResponse.body;
      } else {
        // 로딩 표시 종료
        throw Exception('Failed to create custom token');
      }
    } catch (e) {
      // 로딩 표시 종료
      throw Exception('Failed to create custom token: $e');
    }
  }
}


//예외처리 추가
//HTTP 요청이 실패하는 경우에 대한 예외처리를 추가해야 합니다.
// 예를 들어, http.post 메서드의 반환값인 Response 객체에서
// statusCode를 확인하여 HTTP 응답 코드가 200이 아닌 경우, 예외를 발생시켜야 합니다.
//
//로딩 표시 추가
//HTTP 요청을 보낼 때, 로딩 중인 상태를 사용자에게 알리는 것이 좋습니다.
// 이를 위해서는, HTTP 요청을 보내기 전에 로딩 표시를 시작하고, HTTP 요청이 끝난 후에 로딩 표시를 종료해야 합니다.
// 이를 구현하기 위해서는, http.post 메서드가 반환하는 Future 객체를 사용하여 로딩 표시를 시작하고, then 메서드를 사용하여 HTTP 요청이 끝난 후에 로딩 표시를 종료할 수 있습니다.
//
//try-catch 블록 추가
//HTTP 요청을 보낼 때, 예기치 않은 예외가 발생할 수 있습니다. 이를 처리하기 위해서는,
// try-catch 블록을 추가해야 합니다. 예를 들어, http.post 메서드에서 발생하는 예외들을 캐치하여 처리할 수 있습니다.