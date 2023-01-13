using Android.Media;
using Firebase.Database;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;
using Xamarin.Forms.Shapes;
using static Android.Provider.MediaStore;
using static App2.MainPage;
using Xamarin.Essentials;
using Android.Content;
using Firebase.Database.Query;

namespace App2
{
    public partial class MainPage : ContentPage
    {
        public static string FrebaseSecret = "APG3sJRQtGb50SUj6zHGZHVYZ881yaWLC3CZfTIF";
        private FirebaseClient firebaseClient;
        private Intrument intrument = new Intrument();

        public MainPage()
        {
            InitializeComponent();
            PerformFirebaseAuth();
        }

        private void PerformFirebaseAuth()
        {
            firebaseClient = new FirebaseClient("https://projetzigbee-b0a6f-default-rtdb.europe-west1.firebasedatabase.app",
                new FirebaseOptions
                {
                    AuthTokenAsyncFactory = () => Task.FromResult(FrebaseSecret)
                });
        }
        protected async override void OnAppearing()
        {
            base.OnAppearing();
            await GetItemsAndPlaySong();
        }
        private async Task GetItemsAndPlaySong()
        {
            try
            {
                while (true)
                {
                    var data = await firebaseClient
                         .Child("sensors")
                         .OnceAsync<Sensors>();
                    foreach (var sensor in data)
                    {
                        intrument.PlaySound(sensor.Object.x, sensor.Object.y, sensor.Object.z,sensor.Key);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"{e.Message}");
            }
        }


        private async Task ChangeInstru(string instruName)
        {
            var sensors = new Sensors(false, false, false, instruName);


            if (intrument.currentInstSelected == "Intstrument1")
            {
                intrument.currentInst1 = instruName;
                await firebaseClient
                .Child("sensors/16a2")
                .PutAsync(sensors);
                int1Name.Text = instruName;
            }

            else
            {
                intrument.currentInst2 = instruName;
                await firebaseClient
                .Child("sensors/b0ce")
                .PutAsync(sensors);
                int2Name.Text = instruName;
            }
            lbInstName.Text = $"Instrument : {instruName}";
        }
        #region Buttons Click

        private void ChangeInstTo1(object sender, EventArgs e)
        {
            intrument.currentInstSelected = "Intstrument1";
        }
        private void ChangeInstTo2(object sender, EventArgs e)
        {
            intrument.currentInstSelected = "Intstrument2";
        }
        private async void OnGuitardClicked(object sender, EventArgs e)
        {
            await ChangeInstru("Guitare");
        }
        private async void OnBatterieClicked(object sender, EventArgs e)
        {
            await ChangeInstru("Batterie");
        }
        private async void OnBasseClicked(object sender, EventArgs e)
        {
            await ChangeInstru("Basse");
        }
        private async void OnContreBasseClicked(object sender, EventArgs e)
        {
            await ChangeInstru("ContreBasse");
        }
        private async void OnAccordeonClicked(object sender, EventArgs e)
        {
            await ChangeInstru("Accordeon");
        }
        private async void OnMaracasClicked(object sender, EventArgs e)
        {
            await ChangeInstru("Maracas");
        }
        private async void OnOrgueClicked(object sender, EventArgs e)
        {
            await ChangeInstru("Orgue");
        }
        private async void OnCuillereClicked(object sender, EventArgs e)
        {
            await ChangeInstru("Cuillere");
        }
        #endregion

        public class Sensors
        {
            public Sensors()
            {
            }

            public Sensors(bool x, bool y, bool z,string Instrument)
            {
                this.x = x;
                this.y = y;
                this.z = z;
                this.Instrument = Instrument;
            }

            public bool x { get; set; }
            public bool y { get; set; }
            public bool z { get; set; }
            public string Instrument { get; set; }
        }
        public class Intrument
        {
            public string currentInstSelected { get; set; } = "Intstrument1";
            public string currentInst1 = "Batterie";
            public string currentInst2 = "Guitare";
            public MediaPlayer player;
            public Intrument()
            {
            }
            
            public void PlaySound(bool x, bool y, bool z,string key)
            {
                string instToPlay = key=="16a2"?currentInst1: currentInst2;
                if (x)
                    PlayAudioFile($"{instToPlay}X.mp3");
                if (y)
                    PlayAudioFile($"{instToPlay}Y.mp3");
                if (z)
                    PlayAudioFile($"{instToPlay}Z.mp3");

            }
            
            private void PlayAudioFile(string fileName)
            {
                player = new MediaPlayer();
                var fd = global::Android.App.Application.Context.Assets.OpenFd(fileName);
                player.Prepared += (s, e) =>
                {
                    player.Start();
                };
                player.SetDataSource(fd.FileDescriptor, fd.StartOffset, fd.Length);
                player.Prepare();
            }
        }
    }
}
