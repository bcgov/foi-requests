import {
  Component,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
  Output,
  Input,
  AfterViewInit,
  OnInit,
  EventEmitter,
} from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { CaptchaDataService } from "src/app/services/captcha-data.service";

@Component({
  selector: "captcha",
  templateUrl: "./captcha.component.html",
  styleUrls: ["./captcha.component.scss"],
})
export class CaptchaComponent implements AfterViewInit, OnInit {
  @ViewChild("image", { static: true }) imageContainer: ElementRef;
  @ViewChild("answer", { static: true }) userAnswerRef: ElementRef;
  @ViewChild("audioElement", { static: true }) audioElement: ElementRef;
  @Input("apiBaseUrl") apiBaseUrl: string;
  @Input("nonce") nonce: string;
  @Output() onValidToken = new EventEmitter<string>();
  @Input("successMessage") successMessage: string;
  @Input("eagerFetchAudio") eagerFetchAudio: string;
  @Input("language") language: string = "en";
  @Input("userPromptMessage") userPromptMessage: string;

  fadeIn: boolean = false;

  /**
   * Http error response for fetching a CAPTCHA image.
   */
  errorFetchingImg = null;

  /**
   * Http error response for verifying user's answer.
   */
  errorVerifyAnswer = null;

  private validation = "";
  public audio = "";
  public answer = "";

  state: CAPTCHA_STATE;
  incorrectAnswer: boolean;

  public fetchingAudioInProgress = false;

  constructor(private dataService: CaptchaDataService, private cd: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit() {
    this.forceRefresh.bind(this);
    window["ca.bcgov.captchaRefresh"] = this.publicForceRefresh.bind(this);

    // if(!this.userPromptMessage){
    //   this.userPromptMessage = "Enter the text you either see in the box or you hear in the audio";
    // }
  }
  ngAfterViewInit() {
    this.forceRefresh();
  }

  forceRefresh() {
    this.getNewCaptcha(false);
    this.userAnswerRef.nativeElement.value = "";
    this.cd.detectChanges();
  }

  publicForceRefresh() {
    this.ngZone.run(() => this.forceRefresh());
  }

  answerChanged(event: any) {
    this.answer = this.userAnswerRef.nativeElement.value;
    if (this.answer.length < 6) {
      this.incorrectAnswer = null;
    }
    if (this.answer.length === 6) {
      this.state = CAPTCHA_STATE.VERIFYING_ANSWER;
      this.incorrectAnswer = null;
      this.dataService.verifyCaptcha(this.apiBaseUrl, this.nonce, this.answer, this.validation).subscribe(
        (response) => {
          const payload = response.body;
          if (this.isValidPayload(payload)) {
            this.handleVerify(payload);
          } else {
            this.state = CAPTCHA_STATE.ERROR_VERIFY;
            this.errorVerifyAnswer = this.createErrorTextLine(response);
          }
        },
        (error) => {
          this.state = CAPTCHA_STATE.ERROR_VERIFY;
          this.errorVerifyAnswer = this.createErrorTextLine(error);
          // console.log('Error response from verifying user answer: %o', error);
        }
      );
    }
  }

  // Call the backend to see if our answer is correct
  private handleVerify(payload: any) {
    // There could be the rare change where an invalid payload response is received.
    if (payload.valid === true) {
      this.state = CAPTCHA_STATE.SUCCESS_VERIFY_ANSWER_CORRECT;
      this.onValidToken.emit(payload.jwt);
      setTimeout(() => {
        this.fadeIn = true;
      }, 200);
    } else {
      this.incorrectAnswer = true;
      this.answer = "";
      this.audio = "";
      // They failed - try a new one.
      this.getNewCaptcha(true);

      // Clear the input & set focus after a half-second!
      this.userAnswerRef.nativeElement.value = "";
      setTimeout(() => {
        this.userAnswerRef.nativeElement.focus();
      }, 500);
    }
  }

  /**
   * Case where HTTP 200 response code is received by the payload is incorrect or corrupt.
   * The occurance of this type of case should be rare.
   * @param payload
   */
  private isValidPayload(payload) {
    // console.debug('Response payload: %o', payload);
    if (!payload) {
      // console.error('payload cannot be null or undefined or 0');
      return false;
    } else {
      const hasValueProp = payload.hasOwnProperty("valid");
      if (!hasValueProp) {
        // console.error('payload must have its own property named \'valid\'');
        return false;
      } else {
        return true;
      }
    }
  }

  public retryFetchCaptcha() {
    // console.log('Retry captcha');
    this.state = undefined;

    /**
     * wait for 0.5 seond before resubmitting
     */
    setTimeout(() => {
      this.getNewCaptcha(false);
    }, 100);
  }

  public playAudio(playImmediately: boolean = true) {
    if (this.audio && this.audio.length > 0) {
      this.audioElement.nativeElement.play();
    } else {
      this.fetchAudio(playImmediately);
    }
  }

  private fetchAudio(playImmediately: boolean = false) {
    if (!this.fetchingAudioInProgress) {
      this.fetchingAudioInProgress = true;
      this.dataService.fetchAudio(this.apiBaseUrl, this.validation, this.language).subscribe(
        (response: HttpResponse<any>) => {
          this.fetchingAudioInProgress = false;
          this.audio = response.body.audio;
          this.cd.detectChanges();
          if (playImmediately) {
            this.audioElement.nativeElement.play();
          }
        },
        (error) => {
          this.fetchingAudioInProgress = false;
          console.log("Error response from fetching audio CAPTCHA: %o", error);
          this.cd.detectChanges();
        }
      );
    }
  }

  public getNewCaptcha(errorCase: any) {
    this.state = CAPTCHA_STATE.FETCHING_CAPTCHA_IMG;
    this.audio = "";

    // Reset things
    if (!errorCase) {
      // Let them know they failed instead of wiping out the answer area
      // Contructing this form on page load/reload will have errorCase = false
      this.incorrectAnswer = null;
    }

    this.dataService.fetchData(this.apiBaseUrl, this.nonce).subscribe(
      (response) => {
        this.state = CAPTCHA_STATE.SUCCESS_FETCH_IMG;
        const payload = response.body;
        this.imageContainer.nativeElement.innerHTML = payload.captcha.data;
        this.validation = payload.validation;
        this.cd.detectChanges();

        if (this.eagerFetchAudio === "true") {
          // console.log('Fetch audio eagerly');
          this.fetchAudio();
        } else {
          // console.log('Not to fetch audio eagerly');
        }
      },

      (error) => {
        this.state = CAPTCHA_STATE.ERROR_FETCH_IMG;
        this.errorFetchingImg = this.createErrorTextLine(error);
        // console.log('Error esponse from fetching CAPTCHA text: %o', error);
        this.cd.detectChanges();
      }
    );
  }

  private createErrorTextLine(error) {
    let line = "Error status: " + error.status;
    if (error.statusText) {
      line = line + ", status text: " + error.statusText;
    }
    return line;
  }

  public translatedMessages = {
    playAudio: {
      en: "Play Audio",
      zh: "播放声音",
      fr: "Lecture audio",
      pa: "ਆਡੀਓ ਚਲਾਓ",
    },
    tryAnotherImg: {
      en: "Try another image",
      zh: "换个图像",
      fr: "Essayez une autre image",
      pa: "ਕੋਈ ਹੋਰ ਚਿੱਤਰ ਅਜ਼ਮਾਓ",
    },
    userPromptMessage: {
      en: "Enter the text you either see in the box or you hear in the audio",
      zh: "请输入看到或听到的文字",
      fr: "Entrez le texte que vous voyez dans la case ou que vous entendez dans le son",
      pa: "ਉਹ ਟੈਕਸਟ ਦਾਖਲ ਕਰੋ ਜੋ ਤੁਸੀਂ ਬਕਸੇ ਵਿੱਚ ਦੇਖਦੇ ਹੋ ਜਾਂ ਤੁਸੀਂ ਆਡੀਓ ਵਿੱਚ ਸੁਣਦੇ ਹੋ",
    },
    incorrectAnswer: {
      en: "Incorrect answer, please try again.",
      zh: "答案不对。请重试。",
      fr: "Mauvaise réponse, veuillez réessayer.",
      pa: "ਗਲਤ ਜਵਾਬ, ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ.",
    },
    successMessage: {
      en: "You can submit your application now.",
      zh: "你现在可以提交申请了。",
      fr: "Vous pouvez soumettre votre candidature maintenant.",
      pa: "ਤੁਸੀਂ ਆਪਣੀ ਅਰਜ਼ੀ ਹੁਣੇ ਪੇਸ਼ ਕਰ ਸਕਦੇ ਹੋ",
    },
    correct: {
      en: "Correct.",
      zh: "正确。",
      fr: "Correct.",
      pa: "ਸਹੀ ਕਰੋ",
    },
    loadingImage: {
      en: "Loading CAPTCHA image",
      zh: "正在下载验证码",
      fr: "Chargement de l'image CAPTCHA",
      pa: "ਕੈਪਟਚਾ ਚਿੱਤਰ ਲੋਡ ਕਰ ਰਿਹਾ ਹੈ",
    },
    browserNotSupportAudio: {
      en: "Your browser does not support the audio element.",
      zh: "你的浏览器不支持播音",
      fr: "Votre navigateur ne supporte pas l'élément audio.",
      pa: "ਤੁਹਾਡਾ ਬ੍ਰਾਉਜ਼ਰ ਆਡੀਓ ਐਲੀਮੈਂਟ ਦਾ ਸਮਰਥਨ ਨਹੀਂ ਕਰਦਾ.",
    },
    verifyingAnswer: {
      en: "Verifying your answer...",
      zh: "正在验证答案...",
      fr: "Vérification de votre réponse ...",
      pa: "ਤੁਹਾਡਾ ਜਵਾਬ ਤਸਦੀਕ ਕਰ ਰਿਹਾ ਹੈ ...",
    },
    errorRetrievingImg: {
      en: "Error happened while retrieving CAPTCHA image. please {{click here}} to try again",
      zh: "验证码下载错误。请{{点击这里}}重试",
      fr: "Une erreur s'est produite lors de la récupération de l'image CAPTCHA. s'il vous plaît {{cliquez ici}} pour réessayer",
      pa: "ਕੈਪਟਚਾ ਚਿੱਤਰ ਨੂੰ ਪ੍ਰਾਪਤ ਕਰਦੇ ਸਮੇਂ ਤਰੁੱਟੀ ਉਤਪੰਨ ਹੋਈ. ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰਨ ਲਈ {{ਇੱਥੇ ਕਲਿਕ ਕਰੋ}}",
    },
    errorVerifyingAnswer: {
      en: "Error happened while verifying your answer. please {{click here}} to try again",
      zh: "验证答案过程发生错误。请{{点击这里}}重试",
      fr: "Une erreur s'est produite lors de la vérification de votre réponse. s'il vous plaît {{cliquez ici}} pour réessayer",
      pa: "ਤੁਹਾਡਾ ਜਵਾਬ ਤਸਦੀਕ ਕਰਨ ਵੇਲੇ ਗਲਤੀ ਆਈ ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰਨ ਲਈ {{ਇੱਥੇ ਕਲਿਕ ਕਰੋ}}",
    },
  };
}

/**
 * 7 mutually exclusive states, the program can only be in one of these state
 * at any given point..
 */
enum CAPTCHA_STATE {
  FETCHING_CAPTCHA_IMG = 1,
  SUCCESS_FETCH_IMG = 2,
  ERROR_FETCH_IMG = 3,
  VERIFYING_ANSWER = 4,
  SUCCESS_VERIFY_ANSWER_CORRECT = 5,
  // http error during verification call.
  ERROR_VERIFY = 6,
  // SUCCESS_VERIFY_ANSWER_INCORRECT = 6,
}
