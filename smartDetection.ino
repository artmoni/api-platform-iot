const int PIEZO_PIN = A0; // Piezo output
float initChoc;
const int ledChoc = 7; 
bool isChoc = true;

int trig = 9;
int echo = 8;
int duration;
float distance;
float meter;
int led = 13;

void setup() 
{
  Serial.begin(9600);

  // Paramètres du capteur de proximité
  pinMode(trig, OUTPUT);
  pinMode(led, OUTPUT);
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  pinMode(echo, INPUT);
  digitalWrite(led, LOW);

  // Paramètres du capteur de choc
  pinMode(ledChoc, OUTPUT);
  int piezoADC = analogRead(PIEZO_PIN);
  initChoc = piezoADC / 1023.0 * 5.0;
  digitalWrite(ledChoc, LOW);
}

void loop() 
{
  if (Serial.available() > 0) {
    String input = Serial.readString(); // Lire la chaîne une seule fois
    //Serial.print("Commande reçue : "); // Débogage
    //Serial.println(input); // Afficher la commande reçue pour débogage

    if (input.equals("cameraOn")) {
      //Serial.println("Activation de la caméra"); // Débogage
      digitalWrite(ledChoc, HIGH);
      delay(20000);
      digitalWrite(ledChoc, LOW); // Éteindre la LED après le délai

      String donn = String(1, 2);
      String rep = "{\"cameraOff\":\"" + donn + "\"}";
      Serial.println(rep); // Envoyer la réponse JSON
    }
  }

  // Lire la valeur ADC du piezo et la convertir en tension
  int piezoADC = analogRead(PIEZO_PIN);
  float currentChoc = piezoADC / 1023.0 * 5.0;

  if((currentChoc - initChoc) >= 2 || (initChoc - currentChoc) >= 2) {
    digitalWrite(ledChoc, HIGH);
    String datas = String(currentChoc, 2);
    String json = "{\"capteurChoc\":\"" + datas + "\"}";
    Serial.println(json);
    initChoc = currentChoc;
    delay(2000);
  } else {
    digitalWrite(ledChoc, LOW);
    initChoc = currentChoc;
  }

  // Gestion du capteur de proximité
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);
  duration = pulseIn(echo, HIGH);

  if(duration <= 1000) {
    String datas = String(1, 2);
    String json = "{\"capteurProxi\":\"" + datas + "\"}";
    Serial.println(json);
    digitalWrite(led, HIGH);
  } else if(duration >= 38000) {
    digitalWrite(led, HIGH);
  } else {
    digitalWrite(led, LOW);
  }

  delay(1000);
}
