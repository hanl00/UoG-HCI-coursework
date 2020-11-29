package com.example.covidcompass;

import android.os.Bundle;


import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {
    public EditText etSource,etDestination;
    public Button btRoute;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        etSource = findViewById(R.id.etSource);
        etDestination = findViewById(R.id.etDestination);
        btRoute = findViewById(R.id.btRoute);

        btRoute.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String sSource = etSource.getText().toString().trim();
                String sDestination = etDestination.getText().toString().trim();
                if(sSource.equals("") && sDestination.equals("")){
                    Toast.makeText(getApplicationContext(),"Fill both fields",Toast.LENGTH_SHORT).show();
                }else{
                }

            }
        });

    }
}
